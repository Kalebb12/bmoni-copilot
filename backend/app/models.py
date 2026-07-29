import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    # Naive UTC on purpose: SQLite silently drops tzinfo on round-trip, so a
    # timezone-aware value here would compare unequal to itself after a
    # write+read. Keep every stored timestamp naive-UTC and compare against
    # naive-UTC `datetime.utcnow()`-equivalents everywhere else in the app.
    return datetime.now(timezone.utc).replace(tzinfo=None)


class LocalUser(Base):
    """Local record keyed by the BMONI-issued bmoniUserId.

    Holds only what BMONI doesn't: the hashed transfer PIN and this app's
    contacts/pending transfers. Never stores the raw PIN.
    """

    __tablename__ = "local_users"

    bmoni_user_id: Mapped[str] = mapped_column(String, primary_key=True)
    pin_hash: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    contacts: Mapped[list["Contact"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    pending_transfers: Mapped[list["PendingTransfer"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Contact(Base):
    """A saved recipient: name -> Nigerian bank account.

    `label` disambiguates same-name contacts (e.g. "Musa" + "Office" ->
    displayed/matched as "Musa Office").
    """

    __tablename__ = "contacts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("local_users.bmoni_user_id"), index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    label: Mapped[str | None] = mapped_column(String, nullable=True)
    account_number: Mapped[str] = mapped_column(String, nullable=False)
    bank_code: Mapped[str] = mapped_column(String, nullable=False)
    bank_name: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    user: Mapped["LocalUser"] = relationship(back_populates="contacts")

    @property
    def display_name(self) -> str:
        return f"{self.name} {self.label}".strip() if self.label else self.name


class PendingTransfer(Base):
    """A transfer that has passed the Transaction Guardian check and is
    waiting on spoken-PIN confirmation before it's sent to BMONI.
    """

    __tablename__ = "pending_transfers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("local_users.bmoni_user_id"), index=True)
    contact_id: Mapped[str | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)

    recipient_name: Mapped[str] = mapped_column(String, nullable=False)
    account_number: Mapped[str] = mapped_column(String, nullable=False)
    bank_code: Mapped[str] = mapped_column(String, nullable=False)
    bank_name: Mapped[str | None] = mapped_column(String, nullable=True)

    # Amount in USDB minor units as a string, per BMONI's CreatePayoutInput.
    amount_minor_units: Mapped[str] = mapped_column(String, nullable=False)
    display_amount: Mapped[str] = mapped_column(String, nullable=False)
    currency: Mapped[str] = mapped_column(String, default="NGN")
    country: Mapped[str] = mapped_column(String, default="NGA")
    source_smart_wallet_id: Mapped[str] = mapped_column(String, nullable=False)
    note: Mapped[str | None] = mapped_column(String, nullable=True)

    is_new_recipient: Mapped[bool] = mapped_column(Boolean, default=False)
    warning_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending|confirmed|expired|cancelled

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user: Mapped["LocalUser"] = relationship(back_populates="pending_transfers")
