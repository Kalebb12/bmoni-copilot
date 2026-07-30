"""FastAPI app: voice-first banking copilot backend.

Route groups:
  /voice/*     Whisper transcription, YarnGPT speech synthesis
  /agent/*     intent parsing, plain-language response generation
  /contacts/*  user-scoped contacts CRUD + fuzzy lookup (see contacts.py)
  /transfer/*  guardian-checked, PIN-confirmed bank payouts
  /bmoni/*     thin authenticated proxies to BMONI (balances, transactions,
               onboarding, account verification) — the frontend never holds
               the BMONI API key, so every BMONI call it needs goes through
               here.
"""

from datetime import datetime, timedelta, timezone
from typing import Any


def _utcnow() -> datetime:
    # Naive UTC to match how SQLite round-trips DateTime columns — see the
    # comment on models._now().
    return datetime.now(timezone.utc).replace(tzinfo=None)

from fastapi import Depends, FastAPI, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import agent, guardian, voice
from app.bmoni_client import COUNTRY_NGA, TEST_BVN, BmoniAPIError, BmoniClient
from app.config import get_settings
from app.contacts import get_or_create_local_user
from app.contacts import router as contacts_router
from app.db import get_db, init_db
from app.models import Contact, LocalUser, PendingTransfer
from app.schemas import (
    ContactOut,
    InterpretRequest,
    InterpretResponse,
    RespondRequest,
    RespondResponse,
    SpeakRequest,
    TranscribeResponse,
    TransferConfirmRequest,
    TransferConfirmResponse,
    TransferPrepareRequest,
    TransferPrepareResponse,
)
from app.security import hash_pin, verify_pin

app = FastAPI(title="BMONI Copilot Backend", version="0.1.0")

# Dev-friendly CORS for the Expo app. Tighten allow_origins before shipping.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts_router)


@app.on_event("startup")
def _startup() -> None:
    init_db()


def get_bmoni_client() -> BmoniClient:
    return BmoniClient()


@app.exception_handler(BmoniAPIError)
async def bmoni_error_handler(request, exc: BmoniAPIError) -> Response:
    from fastapi.responses import JSONResponse

    return JSONResponse(
        status_code=502 if exc.status_code is None else exc.status_code,
        content={
            "error": "bmoni_api_error",
            "message": exc.message,
            # Shaped so the frontend can hand this straight to /agent/respond.
            "bmoni_result": {"success": False, "error": exc.message},
        },
    )


@app.exception_handler(voice.VoiceEngineError)
async def voice_error_handler(request, exc: voice.VoiceEngineError) -> Response:
    from fastapi.responses import JSONResponse

    return JSONResponse(status_code=502, content={"error": "voice_engine_error", "message": str(exc)})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# --- Voice ------------------------------------------------------------------------


@app.post("/voice/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile) -> TranscribeResponse:
    audio_bytes = await file.read()
    transcript = await voice.transcribe(audio_bytes, filename_hint=file.filename or "audio.wav")
    return TranscribeResponse(transcript=transcript)


@app.post("/voice/speak")
async def speak_text(payload: SpeakRequest) -> Response:
    audio_bytes = await voice.synthesize(
        payload.text, voice=payload.voice, response_format=payload.response_format
    )
    return Response(content=audio_bytes, media_type=voice.media_type_for(payload.response_format))


# --- Agent ------------------------------------------------------------------------


@app.post("/agent/interpret", response_model=InterpretResponse)
async def interpret(payload: InterpretRequest) -> InterpretResponse:
    result = await agent.interpret_transcript(payload.transcript, payload.conversation_state)
    return InterpretResponse(**result)


@app.post("/agent/respond", response_model=RespondResponse)
async def respond(payload: RespondRequest) -> RespondResponse:
    text = await agent.generate_response(payload.bmoni_result, payload.intent, payload.context)
    return RespondResponse(text=text)


# --- PIN setup (not in the original spec's endpoint list, but required for
#     /transfer/confirm's PIN verification to have anything to verify against) --


@app.post("/users/{user_id}/pin")
def set_pin(user_id: str, pin: str, db: Session = Depends(get_db)) -> dict[str, bool]:
    if not (pin.isdigit() and 4 <= len(pin) <= 6):
        raise HTTPException(status_code=400, detail="PIN must be 4-6 digits")
    user = get_or_create_local_user(db, user_id)
    user.pin_hash = hash_pin(pin)
    db.commit()
    return {"ok": True}


# --- Transfers ----------------------------------------------------------------------


async def _recent_average_ngn_transfer(client: BmoniClient, user_id: str, smart_wallet_id: str) -> float | None:
    try:
        history = await client.get_wallet_transactions(user_id, smart_wallet_id)
    except BmoniAPIError:
        return None

    amounts: list[float] = []
    for txn in history.get("transactions", []):
        if txn.get("direction") != "outgoing":
            continue
        if txn.get("counterpartyCurrency") == "NGN" and txn.get("counterpartyAmount"):
            amounts.append(float(txn["counterpartyAmount"]))
        elif txn.get("currency") == "NGN" and txn.get("amount"):
            amounts.append(float(txn["amount"]))
        if len(amounts) >= 10:
            break

    if not amounts:
        return None
    return sum(amounts) / len(amounts)


@app.post("/transfer/prepare", response_model=TransferPrepareResponse)
async def prepare_transfer(
    payload: TransferPrepareRequest,
    db: Session = Depends(get_db),
    client: BmoniClient = Depends(get_bmoni_client),
) -> TransferPrepareResponse:
    get_or_create_local_user(db, payload.user_id)

    contact: Contact | None = None
    if payload.contact_id:
        contact = db.get(Contact, payload.contact_id)
        if contact is None or contact.user_id != payload.user_id:
            raise HTTPException(status_code=404, detail="Contact not found")
    elif payload.recipient_name:
        contacts = db.query(Contact).filter(Contact.user_id == payload.user_id).all()
        candidates = [{"id": c.id, "display_name": c.display_name} for c in contacts]
        match = await agent.match_contact_name(payload.recipient_name, candidates)
        if match["status"] == "ambiguous":
            matched_ids = {c["id"] for c in match["candidates"]}
            return TransferPrepareResponse(
                status="clarification_needed",
                summary=f"I found more than one contact matching '{payload.recipient_name}'. Which one did you mean?",
                candidates=[ContactOut.model_validate(c) for c in contacts if c.id in matched_ids],
            )
        if match["status"] == "matched":
            contact = db.get(Contact, match["contact_id"])

    if contact is not None:
        account_number = contact.account_number
        bank_code = contact.bank_code
        bank_name = contact.bank_name
        recipient_name = contact.display_name
        is_new_recipient = False
    elif payload.account_number and payload.bank_code:
        verified = await client.verify_nigerian_account(
            payload.user_id, bank_code=payload.bank_code, account_number=payload.account_number
        )
        account_number = verified["accountNumber"]
        bank_code = verified["bankCode"]
        bank_name = verified["bankName"]
        recipient_name = payload.recipient_name or verified["accountName"]
        is_new_recipient = True
    else:
        return TransferPrepareResponse(
            status="clarification_needed",
            summary=(
                "I couldn't find that contact. Please say their bank account number and bank, "
                "or save them as a contact first."
            ),
        )

    conversion = await client.convert_currency(
        payload.user_id, amount=payload.amount_ngn, from_currency="NGN", to_currency="USDB"
    )
    usdb_decimal = float(conversion["convertedAmount"])
    amount_minor_units = str(int(round(usdb_decimal * 1_000_000)))

    recent_average = await _recent_average_ngn_transfer(client, payload.user_id, payload.source_smart_wallet_id)
    result = guardian.evaluate_transfer(
        is_new_recipient=is_new_recipient,
        amount=payload.amount_ngn,
        recent_average=recent_average,
        amount_multiplier=get_settings().guardian_amount_multiplier,
    )

    ttl = get_settings().pending_transfer_ttl_seconds
    pending = PendingTransfer(
        user_id=payload.user_id,
        contact_id=contact.id if contact else None,
        recipient_name=recipient_name,
        account_number=account_number,
        bank_code=bank_code,
        bank_name=bank_name,
        amount_minor_units=amount_minor_units,
        display_amount=f"{payload.amount_ngn:,.2f}",
        currency="NGN",
        country=COUNTRY_NGA,
        source_smart_wallet_id=payload.source_smart_wallet_id,
        note=payload.note,
        is_new_recipient=is_new_recipient,
        warning_message=result.message,
        expires_at=_utcnow() + timedelta(seconds=ttl),
    )
    db.add(pending)
    db.commit()
    db.refresh(pending)

    summary = f"You're about to send {pending.display_amount} naira to {recipient_name}."

    return TransferPrepareResponse(
        status="ready",
        transfer_id=pending.id,
        requires_confirmation=True,
        warning=result.message,
        summary=summary,
    )


@app.post("/transfer/confirm", response_model=TransferConfirmResponse)
async def confirm_transfer(
    payload: TransferConfirmRequest,
    db: Session = Depends(get_db),
    client: BmoniClient = Depends(get_bmoni_client),
) -> TransferConfirmResponse:
    pending = db.get(PendingTransfer, payload.transfer_id)
    if pending is None or pending.status != "pending":
        raise HTTPException(status_code=404, detail="No pending transfer with that ID")

    if _utcnow() > pending.expires_at:
        pending.status = "expired"
        db.commit()
        return TransferConfirmResponse(
            status="expired", message="That transfer request has expired. Please try again."
        )

    user = db.get(LocalUser, pending.user_id)
    if user is None or not user.pin_hash:
        raise HTTPException(status_code=400, detail="No PIN set up for this user")

    if not verify_pin(payload.pin, user.pin_hash):
        return TransferConfirmResponse(
            status="invalid_pin", message="That PIN wasn't right. Please try again."
        )

    try:
        bank_details = {
            "bankId": pending.bank_code,
            "accountNumber": pending.account_number,
            "accountHolderName": pending.recipient_name,
        }
        payout_result = await client.create_payout(
            pending.user_id,
            source_smart_wallet_id=pending.source_smart_wallet_id,
            amount_minor_units=pending.amount_minor_units,
            country=pending.country,
            currency=pending.currency,
            bank_details=bank_details,
            note=pending.note,
        )
    except BmoniAPIError as exc:
        return TransferConfirmResponse(
            status="failed",
            message="Sorry, that transfer couldn't go through. Please try again in a moment.",
            bmoni_result={"success": False, "error": exc.message},
        )

    pending.status = "confirmed"
    db.commit()

    # BMONI's payout endpoint returns a signatureRequest — the transfer isn't
    # on-chain yet until the frontend signs it (via BMONI's SDK) and submits
    # the signature through POST /v1/users/{userId}/smart-wallets/proposals/{id}/sign.
    # We hand that payload straight back to the frontend to complete.
    return TransferConfirmResponse(
        status="completed",
        message=f"Sending {pending.display_amount} naira to {pending.recipient_name}. Please confirm on your device to finish.",
        bmoni_result=payout_result,
    )


# --- BMONI proxies (balances, transactions, onboarding) -----------------------------
# Thin authenticated pass-throughs. The frontend calls these instead of BMONI
# directly, since it never holds BMONI_API_KEY.


@app.get("/bmoni/users/{user_id}/balances")
async def get_balances(user_id: str, client: BmoniClient = Depends(get_bmoni_client)) -> dict:
    return await client.get_balances(user_id)


@app.get("/bmoni/users/{user_id}/wallets")
async def get_wallets(user_id: str, client: BmoniClient = Depends(get_bmoni_client)) -> list:
    return await client.list_smart_wallets(user_id)


@app.get("/bmoni/users/{user_id}/transactions/{smart_wallet_id}")
async def get_transactions(
    user_id: str, smart_wallet_id: str, client: BmoniClient = Depends(get_bmoni_client)
) -> dict:
    return await client.get_wallet_transactions(user_id, smart_wallet_id)


@app.get("/bmoni/users/{user_id}/nigerian-banks")
async def get_nigerian_banks(user_id: str, client: BmoniClient = Depends(get_bmoni_client)) -> dict:
    return await client.list_nigerian_banks(user_id)


@app.post("/bmoni/users/{user_id}/verify-nigerian-account")
async def verify_nigerian_account(
    user_id: str, bank_code: str, account_number: str, client: BmoniClient = Depends(get_bmoni_client)
) -> dict:
    return await client.verify_nigerian_account(user_id, bank_code=bank_code, account_number=account_number)


@app.post("/bmoni/users")
async def create_bmoni_user(
    first_name: str,
    email: str,
    phone_number: str,
    bvn: str | None = None,
    last_name: str | None = None,
    client: BmoniClient = Depends(get_bmoni_client),
) -> dict:
    return await client.create_user(
        first_name=first_name, email=email, phone_number=phone_number, bvn=bvn, last_name=last_name
    )


@app.get("/bmoni/users/{user_id}/onboarding/status")
async def onboarding_status(user_id: str, client: BmoniClient = Depends(get_bmoni_client)) -> dict:
    return await client.get_onboarding_status(user_id)


@app.post("/bmoni/users/{user_id}/kyc/activate")
async def activate_kyc(
    user_id: str, sumsub_level_name: str = "id-and-liveness", client: BmoniClient = Depends(get_bmoni_client)
) -> dict:
    return await client.activate_kyc(user_id, sumsub_level_name=sumsub_level_name)


@app.post("/bmoni/users/{user_id}/onboarding/start-nigeria")
async def start_nigeria_onboarding(
    user_id: str,
    ngn_wallet_address: str,
    ngn_wallet_index: int,
    bvn: str = TEST_BVN,
    client: BmoniClient = Depends(get_bmoni_client),
) -> dict:
    return await client.start_nigeria_onboarding(
        user_id, bvn=bvn, ngn_wallet_address=ngn_wallet_address, ngn_wallet_index=ngn_wallet_index
    )


# --- BMONI smart wallet provisioning (owner-proof + create-managed) -----------------
# Wallet creation/signing itself happens on-device via the frontend's BMONI RN SDK;
# these two calls need the partner API key so they're proxied like everything else.


@app.post("/bmoni/users/{user_id}/smart-wallets/owner-proof-challenge")
async def create_owner_proof_challenge(
    user_id: str, currency: str, user_owner_address: str, client: BmoniClient = Depends(get_bmoni_client)
) -> dict:
    return await client.create_owner_proof_challenge(
        user_id, currency=currency, user_owner_address=user_owner_address
    )


@app.post("/bmoni/users/{user_id}/smart-wallets/create-managed")
async def create_managed_smart_wallet(
    user_id: str,
    currency: str,
    user_owner_address: str,
    owner_proof_challenge_id: str,
    owner_proof_signature: str,
    client: BmoniClient = Depends(get_bmoni_client),
) -> dict:
    return await client.create_managed_smart_wallet(
        user_id,
        currency=currency,
        user_owner_address=user_owner_address,
        owner_proof_challenge_id=owner_proof_challenge_id,
        owner_proof_signature=owner_proof_signature,
    )


@app.post("/bmoni/users/{user_id}/smart-wallets/proposals/{proposal_id}/sign")
async def submit_proposal_signature(
    user_id: str,
    proposal_id: str,
    signature_payload: dict[str, Any],
    client: BmoniClient = Depends(get_bmoni_client),
) -> dict:
    return await client.submit_proposal_signature(user_id, proposal_id, signature_payload)
