# BMONI Copilot — Backend

FastAPI backend for a voice-first accessibility banking app (BMONI x NITHUB hackathon,
July 2026). Orchestrates: speech-to-text → intent parsing → BMONI sandbox API calls →
plain-language response → text-to-speech.

Wallet creation and transaction signing happen on-device via BMONI's React Native SDK on
the Expo app — this backend never signs anything. It receives an already-provisioned
`bmoniUserId` (and smart wallet IDs) from the frontend and uses them for every BMONI call.

## Project layout

```
app/
  main.py          FastAPI app + all routes
  bmoni_client.py  Async wrapper around the BMONI sandbox API
  agent.py         Intent parsing + plain-language response generation (Gemini)
  voice.py         Whisper (STT) + YarnGPT (TTS) wrappers
  contacts.py       Contacts CRUD + fuzzy/LLM-assisted name lookup
  guardian.py       Transaction Guardian (rule-based pre-transfer checks)
  security.py       PIN hashing (bcrypt) — raw PIN is never logged or stored
  models.py / db.py / schemas.py / config.py
```

## Setup

1. **System dependency:** `ffmpeg` must be on `PATH` (Whisper shells out to it to decode
   audio). `apt install ffmpeg` / `brew install ffmpeg`.
2. Create a virtualenv and install dependencies:
   ```sh
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
   `openai-whisper` pulls in `torch`; on a machine with no GPU this is a CPU-only install
   and can take a while the first time.
3. Copy `.env.example` → this repo already has a working `.env` with the BMONI sandbox key,
   a YarnGPT key, and a Gemini key filled in.
4. Run it:
   ```sh
   uvicorn app.main:app --reload --port 8000
   ```
   SQLite database file (`bmoni_copilot.db`) is created automatically on first startup.

Interactive API docs: `http://localhost:8000/docs`.

## Environment variables

See `.env.example` for the full list. The important ones:

| Variable | Purpose |
|---|---|
| `BMONI_API_KEY` | Sandbox partner API key, sent as `x-api-key`. Never logged, never returned to the frontend. |
| `BMONI_BASE_URL` | `https://embedded-dev.bmoni.com` — paths already include `/v1`. |
| `GEMINI_API_KEY` | Powers intent parsing (`/agent/interpret`) and plain-language responses (`/agent/respond`). |
| `GEMINI_MODEL` | Defaults to `gemini-3.5-flash`. |
| `YARNGPT_API_KEY` / `YARNGPT_API_BASE_URL` | YarnGPT's hosted TTS API (`https://yarngpt.ai/api/v1/tts`), already the default. `.env` has a real key. |
| `WHISPER_MODEL_SIZE` | `tiny`/`base`/`small`/`medium`/`large`. `base` is a good default for a hackathon demo. |
| `DATABASE_URL` | SQLite by default. |
| `PENDING_TRANSFER_TTL_SECONDS` | How long a prepared transfer stays valid before the user must reconfirm. |

## API surface

### Voice
- `POST /voice/transcribe` — multipart file upload → `{transcript}` (Whisper).
- `POST /voice/speak` — `{text, voice?, response_format?}` → audio bytes (YarnGPT). `voice`
  defaults to `"Idera"`; see YarnGPT's docs for the other 15 named voices. `response_format`
  is one of `mp3`/`wav`/`opus`/`flac`, default `mp3`. `text` is capped at 2000 characters
  (YarnGPT's own limit).

### Agent
- `POST /agent/interpret` — `{transcript, conversation_state?}` → structured intent
  (`balance_check` / `transfer` / `spending_summary` / `contact_save` / `unknown`) plus
  extracted entities (amount, recipient name, account number, bank name).
- `POST /agent/respond` — `{bmoni_result, intent?, context?}` → a short, jargon-free
  spoken sentence. Never says "smart wallet", "CNGN"/"USDB", "beneficiary", etc.

### Contacts (`/contacts`)
Standard CRUD (`GET`/`POST`/`PUT`/`DELETE`, all scoped by `user_id`) plus:
- `GET /contacts/lookup?user_id=&query=` — fuzzy (rapidfuzz) + LLM-tiebreak matching.
  Returns `matched`, `clarification_needed` (with candidates) when ambiguous, or `none`.

Saving a contact with a name that collides with an existing one (case-insensitive) and no
`label` returns `409` asking for a disambiguating label (e.g. "Musa" → "Musa Office").

### Transfers
- `POST /transfer/prepare` — resolves the recipient (saved contact or a verified Nigerian
  account), converts the naira amount to the BMONI payout currency, runs the **Transaction
  Guardian** (warns if the recipient is new/unsaved or the amount is well above the user's
  recent average), and stores a short-lived pending transfer. Always requires a follow-up
  PIN confirmation regardless of whether a warning fired.
- `POST /transfer/confirm` — `{transfer_id, pin}`. Verifies the PIN (bcrypt, never logged),
  then calls BMONI's payout endpoint.

  **Important:** BMONI's payout endpoint doesn't move money by itself — it returns a
  `signatureRequest` that must be signed with the user's wallet key via BMONI's on-device
  SDK, then submitted through `POST /v1/users/{userId}/smart-wallets/proposals/{proposalId}/sign`
  (wrapped as `BmoniClient.submit_proposal_signature`). `/transfer/confirm` hands that
  payload straight back to the frontend to complete — the spec's "verify PIN, then execute
  via BMONI payout endpoint" is accurate up to the point where a signature is required,
  which is the same on-device-signing boundary as wallet creation.

- `POST /users/{user_id}/pin` — sets/updates the transfer PIN. Not in the original spec's
  endpoint list, but required for `/transfer/confirm`'s PIN check to have anything to check
  against.

### BMONI proxies (`/bmoni/*`)
Thin authenticated pass-throughs (balances, wallets, transactions, Nigerian banks, account
verification, onboarding). The frontend never holds `BMONI_API_KEY`, so every BMONI call it
needs — including the ones used to build the `bmoni_result` passed into `/agent/respond` —
goes through these instead of the frontend calling BMONI directly.

## Security notes

- `BMONI_API_KEY` and `GEMINI_API_KEY` are read from environment variables only —
  never hardcoded, never logged, never included in any response body.
- PINs are hashed with `bcrypt` before storage (`app/security.py`) and are never logged,
  echoed back, or stored in plaintext anywhere, including error messages.
- `/transfer/confirm` is the only endpoint that requires a PIN. Balance checks
  (`/bmoni/users/{id}/balances`) and history reads (`/bmoni/users/{id}/transactions/...`)
  do not.
- BMONI sandbox errors are caught and reshaped into
  `{"error": ..., "message": ..., "bmoni_result": {"success": false, "error": ...}}` so the
  frontend can pass `bmoni_result` straight to `/agent/respond` and get a spoken-friendly
  error message instead of a raw stack trace.

## Known gaps / things to wire up before demo day

- No auth beyond the BMONI-issued `bmoniUserId` acting as the local user key — fine for a
  hackathon sandbox, not for production.
- The Transaction Guardian's "recent average" is a simple mean of up to the last 10
  outgoing NGN transfers pulled from BMONI transaction history; there's no persistence of
  guardian decisions or override history.
