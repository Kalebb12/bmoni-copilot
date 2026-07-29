"""Transaction Guardian: a simple rule-based safety check run before every
transfer. Balance checks and history reads never go through this — only
transfers.

Two independent rules, either of which triggers a warning:
  (a) the recipient has no saved contact for this user (new/unsaved), or
  (b) the amount is significantly higher than the user's recent average
      transfer amount.
"""

from dataclasses import dataclass, field


@dataclass
class GuardianResult:
    warn: bool
    reasons: list[str] = field(default_factory=list)
    message: str | None = None


def evaluate_transfer(
    *,
    is_new_recipient: bool,
    amount: float,
    recent_average: float | None,
    amount_multiplier: float = 2.0,
) -> GuardianResult:
    reasons: list[str] = []

    if is_new_recipient:
        reasons.append("new_recipient")

    if recent_average is not None and recent_average > 0 and amount > recent_average * amount_multiplier:
        reasons.append("unusually_large_amount")

    if not reasons:
        return GuardianResult(warn=False)

    if "new_recipient" in reasons and "unusually_large_amount" in reasons:
        message = "This is a new recipient and a larger amount than usual. Are you sure?"
    elif "new_recipient" in reasons:
        message = "You haven't sent money to this person before. Are you sure you want to continue?"
    else:
        message = "This amount is much larger than what you usually send. Are you sure you want to continue?"

    return GuardianResult(warn=True, reasons=reasons, message=message)
