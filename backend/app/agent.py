"""Intent parsing and plain-language response generation via Gemini.

Two jobs live here:
  1. interpret_transcript — turn a raw (possibly messy, Whisper-transcribed)
     sentence into a structured intent + entities.
  2. generate_response — turn a raw BMONI API result into a short, spoken
     sentence a low-literacy/visually-impaired user can understand, with no
     technical jargon.

Both use a low temperature — this is a voice UX where latency and
consistency matter far more than creativity, and both tasks are simple
extraction/rewriting.
"""

from typing import Any, Literal

from google import genai
from google.genai import types
from pydantic import BaseModel
from rapidfuzz import fuzz

from app.config import get_settings

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=get_settings().gemini_api_key)
    return _client


VALID_INTENTS = ("balance_check", "transfer", "spending_summary", "contact_save", "unknown")


class IntentResult(BaseModel):
    intent: Literal["balance_check", "transfer", "spending_summary", "contact_save", "unknown"]
    amount: str | None = None
    recipient_name: str | None = None
    account_number: str | None = None
    bank_name: str | None = None
    contact_label: str | None = None
    confidence: Literal["high", "medium", "low"]


_INTERPRET_SYSTEM_PROMPT = """You parse voice-transcribed requests for a Nigerian banking app used by \
low-literacy, elderly, visually impaired, and motor-impaired users. Whisper transcription may contain \
misspellings, filler words, or half-finished sentences — infer intent generously from context.

Classify into exactly one intent:
- balance_check: user wants to know how much money they have
- transfer: user wants to send money to someone
- spending_summary: user wants a summary/history of recent spending or transactions
- contact_save: user wants to save/remember a person's account details for future transfers
- unknown: anything else, or too unclear to classify

Extract only entities the user actually said. Leave fields null rather than guessing. Amounts spoken in \
words (e.g. "five thousand naira") should be converted to plain digits (e.g. "5000")."""


async def interpret_transcript(
    transcript: str, conversation_state: dict[str, Any] | None = None
) -> dict[str, Any]:
    context_note = ""
    if conversation_state:
        context_note = f"\n\nConversation so far (for context only): {conversation_state}"

    response = await _get_client().aio.models.generate_content(
        model=get_settings().gemini_model,
        contents=f'Transcript: "{transcript}"{context_note}',
        config=types.GenerateContentConfig(
            system_instruction=_INTERPRET_SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=IntentResult,
            temperature=0.1,
        ),
    )
    result: IntentResult = response.parsed
    return result.model_dump()


_RESPOND_SYSTEM_PROMPT = """You turn raw banking API results into a single short sentence spoken aloud to \
a low-literacy, elderly, or visually impaired user. Rules:
- One or two short sentences, plain everyday language, no jargon.
- Never say "smart wallet" — say "your account". Never say "CNGN" or "USDB" — say "naira". Never say \
"beneficiary" — say "the person receiving the money". Never say "proposal", "signature", "transaction hash", \
or any blockchain/technical term.
- If the result is an error, apologize briefly and say plainly what went wrong and what to do next — don't \
read out raw error codes or technical messages.
- Never read out a PIN, password, or full account number — if one appears in the data, omit it.
- Output only the sentence to be spoken. No labels, no markdown, no quotes."""


async def generate_response(
    bmoni_result: dict[str, Any], intent: str | None = None, context: dict[str, Any] | None = None
) -> str:
    payload = {"intent": intent, "result": bmoni_result, "context": context or {}}
    response = await _get_client().aio.models.generate_content(
        model=get_settings().gemini_model,
        contents=f"Data: {payload}",
        config=types.GenerateContentConfig(system_instruction=_RESPOND_SYSTEM_PROMPT, temperature=0.3),
    )
    return response.text.strip()


# --- Fuzzy / LLM-assisted contact matching -----------------------------------

_FUZZY_MATCH_THRESHOLD = 70  # below this, treat as "no match"
_FUZZY_AMBIGUOUS_GAP = 8  # if top two scores are this close, ask the LLM to break the tie


class _TieBreakResult(BaseModel):
    matched_id: str | None = None


async def match_contact_name(
    spoken_name: str, candidates: list[dict[str, Any]]
) -> dict[str, Any]:
    """Matches a spoken name against a user's saved contacts.

    `candidates` is a list of {"id": str, "display_name": str}. Returns one of:
      {"status": "matched", "contact_id": str}
      {"status": "ambiguous", "candidates": [{"id", "display_name"}, ...]}
      {"status": "none"}
    """
    if not candidates:
        return {"status": "none"}

    scored = sorted(
        (
            {**c, "score": fuzz.token_sort_ratio(spoken_name.lower(), c["display_name"].lower())}
            for c in candidates
        ),
        key=lambda c: c["score"],
        reverse=True,
    )

    top = scored[0]
    if top["score"] < _FUZZY_MATCH_THRESHOLD:
        return {"status": "none"}

    close_contenders = [c for c in scored if top["score"] - c["score"] <= _FUZZY_AMBIGUOUS_GAP]
    if len(close_contenders) == 1:
        return {"status": "matched", "contact_id": top["id"]}

    # Ambiguous by string distance alone — let the LLM make the final call,
    # since it can reason about likely mishearings that edit-distance can't.
    llm_pick = await _llm_break_tie(spoken_name, close_contenders)
    if llm_pick is not None:
        return {"status": "matched", "contact_id": llm_pick}

    return {
        "status": "ambiguous",
        "candidates": [{"id": c["id"], "display_name": c["display_name"]} for c in close_contenders],
    }


async def _llm_break_tie(spoken_name: str, candidates: list[dict[str, Any]]) -> str | None:
    options = "\n".join(f'- id="{c["id"]}": "{c["display_name"]}"' for c in candidates)
    response = await _get_client().aio.models.generate_content(
        model=get_settings().gemini_model,
        contents=f'Spoken name: "{spoken_name}"\nCandidates:\n{options}',
        config=types.GenerateContentConfig(
            system_instruction=(
                "A user said a contact's name aloud, transcribed by speech-to-text (so it may be "
                "misspelled or mispronounced). Pick the single most likely intended contact from the "
                "candidates, or return null if it's genuinely ambiguous between two or more."
            ),
            response_mime_type="application/json",
            response_schema=_TieBreakResult,
            temperature=0.1,
        ),
    )
    result: _TieBreakResult = response.parsed
    return result.matched_id
