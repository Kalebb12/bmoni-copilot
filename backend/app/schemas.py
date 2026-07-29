from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

Intent = Literal["balance_check", "transfer", "spending_summary", "contact_save", "unknown"]


# --- Voice --------------------------------------------------------------------


class TranscribeResponse(BaseModel):
    transcript: str


class SpeakRequest(BaseModel):
    text: str = Field(max_length=2000)
    voice: str = "Idera"
    response_format: Literal["mp3", "wav", "opus", "flac"] = "mp3"


# --- Agent ----------------------------------------------------------------------


class InterpretRequest(BaseModel):
    transcript: str
    conversation_state: dict[str, Any] | None = None


class InterpretResponse(BaseModel):
    intent: Intent
    amount: str | None = None
    recipient_name: str | None = None
    account_number: str | None = None
    bank_name: str | None = None
    contact_label: str | None = None
    confidence: Literal["high", "medium", "low"]


class RespondRequest(BaseModel):
    bmoni_result: dict[str, Any]
    intent: Intent | None = None
    context: dict[str, Any] | None = None


class RespondResponse(BaseModel):
    text: str


# --- Contacts -----------------------------------------------------------------


class ContactCreate(BaseModel):
    user_id: str
    name: str
    account_number: str
    bank_code: str
    bank_name: str | None = None
    label: str | None = None


class ContactUpdate(BaseModel):
    name: str | None = None
    account_number: str | None = None
    bank_code: str | None = None
    bank_name: str | None = None
    label: str | None = None


class ContactOut(BaseModel):
    id: str
    name: str
    label: str | None
    display_name: str
    account_number: str
    bank_code: str
    bank_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactLookupResponse(BaseModel):
    status: Literal["matched", "ambiguous", "clarification_needed", "none"]
    contact: ContactOut | None = None
    candidates: list[ContactOut] | None = None


# --- Transfers ------------------------------------------------------------------


class TransferPrepareRequest(BaseModel):
    user_id: str
    source_smart_wallet_id: str
    amount_ngn: float = Field(gt=0, description="Amount in naira, e.g. 5000.00")
    recipient_name: str | None = None
    contact_id: str | None = None
    account_number: str | None = None
    bank_code: str | None = None
    note: str | None = None


class TransferPrepareResponse(BaseModel):
    status: Literal["ready", "clarification_needed"]
    transfer_id: str | None = None
    requires_confirmation: bool = False
    warning: str | None = None
    summary: str
    candidates: list[ContactOut] | None = None


class TransferConfirmRequest(BaseModel):
    transfer_id: str
    pin: str


class TransferConfirmResponse(BaseModel):
    status: Literal["completed", "failed", "expired", "invalid_pin"]
    message: str
    bmoni_result: dict[str, Any] | None = None
