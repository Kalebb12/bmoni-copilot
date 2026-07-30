"""Thin async wrapper around BMONI's sandbox API.

Auth: every request carries the partner API key in the `x-api-key` header,
read once from settings (which reads it from the BMONI_API_KEY env var).
The key is never logged and never returned to the frontend.

Note on wallets: this backend never creates or signs a smart wallet — that
happens on-device via BMONI's React Native SDK. Every method here takes an
already-provisioned `bmoni_user_id` (and, where relevant, a
`source_smart_wallet_id`) supplied by the frontend.

Note on payouts: `create_payout` does not move money by itself. BMONI
returns a `signatureRequest` (EIP-712 payload) that must be signed with the
user's wallet key via the frontend SDK, then submitted through
`submit_proposal_signature`. See /transfer/confirm in main.py for how this
is wired into the voice flow.
"""

from typing import Any

import httpx

from app.config import get_settings

# Sandbox test values called out in the BMONI docs for KYC.
TEST_BVN = "22222222222"
COUNTRY_NGA = "NGA"


class BmoniAPIError(Exception):
    """Raised for any non-2xx response from BMONI, or a network failure.

    `status_code` is None for network-level failures (timeout, DNS, etc.)
    so callers can distinguish "BMONI said no" from "couldn't reach BMONI".
    """

    def __init__(self, message: str, status_code: int | None = None, detail: Any = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail


class BmoniClient:
    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = settings.bmoni_base_url.rstrip("/")
        self._api_key = settings.bmoni_api_key

    def _headers(self) -> dict[str, str]:
        return {"x-api-key": self._api_key, "content-type": "application/json"}

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        url = f"{self._base_url}{path}"
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(
                    method, url, headers=self._headers(), json=json, params=params
                )
        except httpx.RequestError as exc:
            raise BmoniAPIError(f"Could not reach BMONI: {exc}") from exc

        if response.status_code >= 400:
            try:
                detail = response.json()
                message = detail.get("message", response.text)
            except ValueError:
                detail = response.text
                message = response.text
            raise BmoniAPIError(message, status_code=response.status_code, detail=detail)

        if not response.content:
            return {}
        return response.json()

    # --- Users & KYC -----------------------------------------------------

    async def create_user(
        self,
        *,
        first_name: str,
        email: str,
        phone_number: str,
        last_name: str | None = None,
        bvn: str | None = None,
        **extra: Any,
    ) -> dict[str, Any]:
        payload = {
            "firstName": first_name,
            "email": email,
            "phoneNumber": phone_number,
            **({"lastName": last_name} if last_name else {}),
            **({"bvn": bvn} if bvn else {}),
            **extra,
        }
        return await self._request("POST", "/v1/users", json=payload)

    async def get_onboarding_status(self, user_id: str) -> dict[str, Any]:
        return await self._request("GET", f"/v1/users/{user_id}/onboarding/status")

    async def activate_kyc(self, user_id: str, sumsub_level_name: str = "id-and-liveness") -> dict[str, Any]:
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/kyc/activate",
            json={"sumsubLevelName": sumsub_level_name},
        )

    async def start_nigeria_onboarding(
        self,
        user_id: str,
        *,
        bvn: str,
        ngn_wallet_address: str,
        ngn_wallet_index: int,
    ) -> dict[str, Any]:
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/onboarding/start-nigeria",
            json={
                "bvn": bvn,
                "ngnWalletAddress": ngn_wallet_address,
                "ngnWalletIndex": ngn_wallet_index,
            },
        )

    # --- Smart wallets -----------------------------------------------------

    async def list_smart_wallets(self, user_id: str) -> list[dict[str, Any]]:
        result = await self._request("GET", f"/v1/users/{user_id}/smart-wallets/account/wallets")
        # This endpoint returns a bare array, not an object.
        return result if isinstance(result, list) else result.get("data", [])

    async def get_balances(self, user_id: str) -> dict[str, Any]:
        return await self._request("GET", f"/v1/users/{user_id}/smart-wallets/account/balances")

    async def get_wallet_transactions(self, user_id: str, smart_wallet_id: str) -> dict[str, Any]:
        return await self._request("GET", f"/v1/users/{user_id}/transactions/{smart_wallet_id}")

    # --- Nigerian bank accounts --------------------------------------------

    async def list_nigerian_banks(self, user_id: str) -> dict[str, Any]:
        return await self._request("GET", f"/v1/users/{user_id}/bank-accounts/nigerian-banks")

    async def verify_nigerian_account(
        self, user_id: str, *, bank_code: str, account_number: str
    ) -> dict[str, Any]:
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/bank-accounts/verify-nigerian-account",
            json={"bankCode": bank_code, "accountNumber": account_number},
        )

    # --- Exchange -------------------------------------------------------------

    async def convert_currency(
        self, user_id: str, *, amount: float, from_currency: str, to_currency: str
    ) -> dict[str, Any]:
        """Converts `amount` (in `from_currency`) to `to_currency` at the live
        rate. Used to turn a spoken NGN amount into the USDB amount BMONI's
        payout endpoint expects as its funding-side `amount`.
        """
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/exchange/convert",
            json={"amount": amount, "from": from_currency, "to": to_currency},
        )

    # --- Payouts -------------------------------------------------------------

    async def create_payout(
        self,
        user_id: str,
        *,
        source_smart_wallet_id: str,
        amount_minor_units: str,
        country: str,
        currency: str,
        bank_details: dict[str, Any],
        note: str | None = None,
    ) -> dict[str, Any]:
        """Initiates a bank payout. Returns a signatureRequest + quote — the
        payout is NOT complete until the frontend signs it and the signature
        is submitted via `submit_proposal_signature`.
        """
        payload: dict[str, Any] = {
            "sourceSmartWalletId": source_smart_wallet_id,
            "amount": amount_minor_units,
            "country": country,
            "currency": currency,
            "bankDetails": bank_details,
        }
        if note:
            payload["note"] = note
        return await self._request("POST", f"/v1/users/{user_id}/payouts", json=payload)

    async def submit_proposal_signature(
        self, user_id: str, proposal_id: str, signature_payload: dict[str, Any]
    ) -> dict[str, Any]:
        """Submits the wallet-signed EIP-712 signature to finalize a payout
        proposal. `signature_payload` comes from the frontend's BMONI SDK
        signing step — this backend never has access to signing keys.
        """
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/smart-wallets/proposals/{proposal_id}/sign",
            json=signature_payload,
        )

    # --- Smart wallet provisioning (owner-proof + create-managed) ------------
    # Wallet creation itself happens on-device via the frontend's BMONI RN SDK
    # (bmoni_embedded_sdk); these two calls need the partner API key, so they're
    # proxied here the same as every other BMONI call.

    async def create_owner_proof_challenge(
        self, user_id: str, *, currency: str, user_owner_address: str
    ) -> dict[str, Any]:
        """Returns a short-lived EIP-191 message that `user_owner_address` must
        sign (via the RN SDK's `signMessage`) before calling
        `create_managed_smart_wallet`.
        """
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/smart-wallets/owner-proof-challenges",
            json={"currency": currency, "userOwnerAddress": user_owner_address},
        )

    async def create_managed_smart_wallet(
        self,
        user_id: str,
        *,
        currency: str,
        user_owner_address: str,
        owner_proof_challenge_id: str,
        owner_proof_signature: str,
    ) -> dict[str, Any]:
        """Creates (or reuses, for an existing treasury) a managed smart wallet
        for `currency`, registering `user_owner_address` as an owner alongside
        BMONI's KMS custodian. Consumes the owner-proof challenge.
        """
        return await self._request(
            "POST",
            f"/v1/users/{user_id}/smart-wallets/create-managed",
            json={
                "currency": currency,
                "userOwnerAddress": user_owner_address,
                "ownerProofChallengeId": owner_proof_challenge_id,
                "ownerProofSignature": owner_proof_signature,
            },
        )
