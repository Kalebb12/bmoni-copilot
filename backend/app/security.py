"""PIN hashing helpers.

The raw PIN must never be logged, stored, or echoed back in any response.
Only `pin_hash` is persisted; `verify_pin` is the sole place a raw PIN is
compared, and it never raises with the PIN in the exception message.

Uses `bcrypt` directly rather than passlib — passlib 1.7.4's bcrypt backend
detection is broken against bcrypt>=4.1 (it probes a removed `__about__`
attribute and mis-fires its "password too long" self-test on any input).
"""

import bcrypt


def hash_pin(pin: str) -> str:
    return bcrypt.hashpw(pin.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_pin(pin: str, pin_hash: str) -> bool:
    try:
        return bcrypt.checkpw(pin.encode("utf-8"), pin_hash.encode("utf-8"))
    except ValueError:
        return False
