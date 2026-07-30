# Backend Summary — BMONI Copilot

**Stack:** FastAPI (Python 3.12) + SQLAlchemy/SQLite, built for a voice-first accessibility banking app (BMONI × NITHUB hackathon, July 2026).

**What it does:** orchestrates the pipeline speech → intent → BMONI sandbox call → plain-language reply → speech. It never signs transactions — wallet creation and signing happen on-device via BMONI's React Native SDK; the backend just holds `bmoniUserId`/wallet IDs and proxies BMONI calls (since the frontend never holds `BMONI_API_KEY`).

## Layout (`backend/app/`)

| File | Role |
|---|---|
| `main.py` | All FastAPI routes, grouped as `/voice`, `/agent`, `/contacts`, `/transfer`, `/bmoni` |
| `bmoni_client.py` | Async wrapper around the BMONI sandbox API |
| `agent.py` | Intent parsing + plain-language responses via Gemini (`gemini-3.5-flash`) |
| `voice.py` | Whisper (STT, local) + YarnGPT (TTS, hosted API) |
| `contacts.py` | Contacts CRUD + fuzzy (rapidfuzz) + LLM-assisted name lookup |
| `guardian.py` | Transaction Guardian — rule-based pre-transfer safety check |
| `security.py` | bcrypt PIN hashing; raw PIN never logged/stored |
| `models.py` / `db.py` / `schemas.py` / `config.py` | ORM models, DB session, Pydantic schemas, env-based settings |

## Data model (SQLite via SQLAlchemy)

- **LocalUser** — keyed by `bmoniUserId`, stores only the bcrypt `pin_hash` (BMONI owns everything else).
- **Contact** — name + Nigerian bank account; `label` disambiguates same-name contacts ("Musa" → "Musa Office").
- **PendingTransfer** — a transfer that passed the Guardian check and is waiting on PIN confirmation; has a TTL (`PENDING_TRANSFER_TTL_SECONDS`, default 300s) and status `pending/confirmed/expired/cancelled`.

## API surface

- **Voice**: `POST /voice/transcribe` (Whisper), `POST /voice/speak` (YarnGPT TTS, 15 voices, 2000-char cap).
- **Agent**: `POST /agent/interpret` (transcript → structured intent: `balance_check`/`transfer`/`spending_summary`/`contact_save`/`unknown` + entities), `POST /agent/respond` (BMONI result → short spoken sentence, avoids jargon like "smart wallet"/"CNGN").
- **Contacts** (`/contacts`): CRUD + `GET /contacts/lookup` fuzzy/LLM matching; name collisions without a `label` return `409`.
- **Transfers**: `POST /transfer/prepare` (resolves recipient, converts NGN→USDB, runs Guardian, stores a pending transfer, always requires PIN follow-up) and `POST /transfer/confirm` (`transfer_id` + `pin` → calls BMONI payout, hands back a `signatureRequest` for the frontend to sign on-device — the backend stops at that boundary).
- `POST /users/{user_id}/pin` — sets the transfer PIN (added beyond original spec, needed for confirm to have something to check).
- **BMONI proxies** (`/bmoni/*`): balances, wallets, transactions, Nigerian bank list, account verification, user creation, onboarding, KYC.

## Transaction Guardian (`guardian.py`)

Two independent rules, either fires a warning (never blocks):
- recipient is new/unsaved
- amount > `guardian_amount_multiplier` (default 2×) the mean of the user's last ≤10 outgoing NGN transfers

## Security posture

- API keys (`BMONI_API_KEY`, `GEMINI_API_KEY`) env-only, never logged/returned.
- PINs bcrypt-hashed, never logged or echoed.
- Only `/transfer/confirm` requires a PIN; balance/history reads don't.
- BMONI errors are reshaped into a consistent `{error, message, bmoni_result}` so the frontend can feed failures straight into `/agent/respond`.

## Known gaps (from README, "before demo day")

- No auth beyond the BMONI-issued user ID as the local key — fine for hackathon sandbox, not production.
- Guardian's "recent average" has no persistence of past decisions/overrides.

## Recent history

The backend was added via "Refactor code structure for improved readability" and a follow-up commit adding `psycopg2-binary` for Postgres support (currently still defaults to SQLite).
