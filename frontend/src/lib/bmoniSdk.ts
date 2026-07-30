// Thin wrapper over @bkey-inc/bmoni_embedded_sdk (see backend/reactnative.md).
// This is the ONLY module allowed to touch the SDK directly — wallet
// creation and signing never happen anywhere else in this app, matching the
// backend's own "we never sign anything" boundary.
import { BmoniEmbeddedSdk, BmoniSignerError, BmoniSignerErrorCode } from '@bkey-inc/bmoni_embedded_sdk';

const PIN_LENGTH = 6;

let initialized = false;

export function initBmoniSdk(): void {
  if (initialized) return;
  BmoniEmbeddedSdk.initialize({ pinLength: PIN_LENGTH, requirePin: true });
  initialized = true;
}

export { PIN_LENGTH };

export async function hasOnDeviceWallet(): Promise<boolean> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.hasWallet();
}

export async function getOwnerWalletAddress(): Promise<string | null> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.walletAddress();
}

/** Provisions a fresh on-device wallet. Throws if one already exists. */
export async function createOwnerWallet(): Promise<string> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.initWallet();
}

/** Sets the on-device signing PIN. Must be the same value sent to the backend's
 * `POST /users/{id}/pin` — see onboarding/pin.tsx for why. */
export async function setSigningPin(pin: string): Promise<void> {
  initBmoniSdk();
  await BmoniEmbeddedSdk.setPin(pin);
}

export async function hasSigningPin(): Promise<boolean> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.hasPin();
}

/** Signs BMONI's owner-proof challenge message (EIP-191). */
export async function signOwnerProofChallenge(message: string, pin: string): Promise<string> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.signMessage(message, pin);
}

/** Signs a payout's `hashToSign` (a pre-computed 32-byte digest, no prefixing). */
export async function signPayoutHash(hashHex: string, pin: string): Promise<string> {
  initBmoniSdk();
  return BmoniEmbeddedSdk.signTransactionHash(hashHex, pin);
}

/** Maps a BmoniSignerError to a plain-language sentence — never surface raw
 * error codes/messages in the voice UI. */
export function describeSignerError(error: unknown): string {
  if (!(error instanceof BmoniSignerError)) {
    return "Something went wrong on this device. Please try again.";
  }
  switch (error.errorCode) {
    case BmoniSignerErrorCode.pinMismatch:
      return "That PIN wasn't right. Please try again.";
    case BmoniSignerErrorCode.pinNotSet:
      return 'No PIN has been set up on this device yet.';
    case BmoniSignerErrorCode.pinInvalid:
      return `Please say a ${PIN_LENGTH}-digit PIN.`;
    case BmoniSignerErrorCode.walletAlreadyExists:
      return 'An account already exists on this device.';
    default:
      return 'Something went wrong confirming this on your device. Please try again.';
  }
}
