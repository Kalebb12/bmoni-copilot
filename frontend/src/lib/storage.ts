import * as SecureStore from 'expo-secure-store';

// Everything BMONI hands back after onboarding, persisted on-device so the
// app doesn't need to re-provision a wallet or re-run KYC on every launch.
// There's no server-side auth beyond the bmoniUserId itself (see backend
// README's "Known gaps"), so this device-local record IS the session.
const KEYS = {
  bmoniUserId: 'bmoni_user_id',
  phoneNumber: 'phone_number',
  ownerWalletAddress: 'owner_wallet_address',
  sourceSmartWalletId: 'source_smart_wallet_id',
  onboardingComplete: 'onboarding_complete',
} as const;

export type SessionRecord = {
  bmoniUserId: string | null;
  phoneNumber: string | null;
  ownerWalletAddress: string | null;
  sourceSmartWalletId: string | null;
  onboardingComplete: boolean;
};

export async function loadSession(): Promise<SessionRecord> {
  const [bmoniUserId, phoneNumber, ownerWalletAddress, sourceSmartWalletId, onboardingComplete] = await Promise.all([
    SecureStore.getItemAsync(KEYS.bmoniUserId),
    SecureStore.getItemAsync(KEYS.phoneNumber),
    SecureStore.getItemAsync(KEYS.ownerWalletAddress),
    SecureStore.getItemAsync(KEYS.sourceSmartWalletId),
    SecureStore.getItemAsync(KEYS.onboardingComplete),
  ]);
  return {
    bmoniUserId,
    phoneNumber,
    ownerWalletAddress,
    sourceSmartWalletId,
    onboardingComplete: onboardingComplete === 'true',
  };
}

export async function saveBmoniUserId(bmoniUserId: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.bmoniUserId, bmoniUserId);
}

export async function savePhoneNumber(phoneNumber: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.phoneNumber, phoneNumber);
}

export async function saveOwnerWalletAddress(address: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ownerWalletAddress, address);
}

export async function saveSourceSmartWalletId(walletId: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.sourceSmartWalletId, walletId);
}

export async function markOnboardingComplete(): Promise<void> {
  await SecureStore.setItemAsync(KEYS.onboardingComplete, 'true');
}

export async function clearSession(): Promise<void> {
  await Promise.all(Object.values(KEYS).map((key) => SecureStore.deleteItemAsync(key)));
}
