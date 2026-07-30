import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/components/ErrorBanner';
import { LabeledInput } from '@/components/LabeledInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/context/SessionContext';
import { Spacing } from '@/constants/theme';
import { api, ApiError } from '@/lib/api';
import {
  createOwnerWallet,
  describeSignerError,
  getOwnerWalletAddress,
  hasOnDeviceWallet,
  hasSigningPin,
  PIN_LENGTH,
  setSigningPin,
  signOwnerProofChallenge,
} from '@/lib/bmoniSdk';
import { isValidPinLength } from '@/lib/pinWords';

// The BMONI payout endpoint this app uses is contractually funded from a
// USDB-denominated wallet (see /transfer/prepare's NGN->USDB conversion) —
// so onboarding provisions a USDB smart wallet, not NGN/cNGN directly.
const WALLET_CURRENCY = 'USDB';
// The RN SDK provisions a single on-device EOA with no HD-index concept, so
// there's no real value to derive here for BMONI's Nigeria-rail wallet
// index — hardcoded pending sandbox verification (see plan's design notes).
const NGN_WALLET_INDEX = 0;

type Stage = 'checking' | 'set_pin' | 'registering' | 'unsupported' | 'error';

export default function WalletSetup() {
  const { bmoniUserId, setOwnerWalletAddress, setSourceSmartWalletId } = useSession();
  const [stage, setStage] = useState<Stage>('checking');
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    (async () => {
      const [existingWallet, existingPin] = await Promise.all([hasOnDeviceWallet(), hasSigningPin()]);
      if (existingWallet || existingPin) {
        // A previous attempt was interrupted mid-setup. Recovering this
        // safely needs the original PIN, which this screen never persists —
        // out of scope for the hackathon build. See plan notes.
        setStage('unsupported');
        return;
      }
      setStage('set_pin');
    })();
  }, []);

  const runRegistration = async (userId: string, chosenPin: string) => {
    setStage('registering');
    setError(null);
    try {
      const address = (await hasOnDeviceWallet()) ? await getOwnerWalletAddress() : await createOwnerWallet();
      if (!address) throw new Error('Could not read the wallet address from this device.');
      await setOwnerWalletAddress(address);

      const challenge = await api.bmoni.ownerProofChallenge(userId, WALLET_CURRENCY, address);
      const signature = await signOwnerProofChallenge(challenge.message, chosenPin);
      const wallet = await api.bmoni.createManagedSmartWallet(
        userId,
        WALLET_CURRENCY,
        address,
        challenge.challengeId,
        signature
      );
      await setSourceSmartWalletId(wallet.id);
      await api.bmoni.startNigeriaOnboarding(userId, address, NGN_WALLET_INDEX);

      router.replace('/onboarding/test-funds');
    } catch (err) {
      setStage('error');
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(describeSignerError(err));
      }
    }
  };

  const onSetPin = async () => {
    if (!bmoniUserId) return;
    if (!isValidPinLength(pin, PIN_LENGTH)) {
      setError(`Please enter a ${PIN_LENGTH}-digit PIN.`);
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs don't match.");
      return;
    }
    setError(null);
    try {
      // The same PIN gates both the backend's transfer confirmation and this
      // device's on-chain signing — see the plan's "one PIN, not two" note.
      await setSigningPin(pin);
      await api.setPin(bmoniUserId, pin);
      await runRegistration(bmoniUserId, pin);
    } catch (err) {
      setStage('set_pin');
      setError(err instanceof ApiError ? err.message : describeSignerError(err));
    }
  };

  if (stage === 'checking') {
    return <LoadingOverlay label="Checking this device…" />;
  }

  if (stage === 'registering') {
    return <LoadingOverlay label="Setting up your secure account…" />;
  }

  if (stage === 'unsupported') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Setup was interrupted</ThemedText>
          <ThemedText type="body">
            This device already has a partial account set up on it. Please reinstall the app to start fresh, or
            contact hackathon staff for help.
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Choose a PIN</ThemedText>
        <ThemedText type="body">
          This {PIN_LENGTH}-digit PIN confirms transfers and protects your account. You&apos;ll say it out loud each
          time you send money, so pick something you can say clearly.
        </ThemedText>

        {error && <ErrorBanner message={error} />}

        <LabeledInput
          label="PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={PIN_LENGTH}
        />
        <LabeledInput
          label="Confirm PIN"
          value={confirmPin}
          onChangeText={setConfirmPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={PIN_LENGTH}
        />

        <PrimaryButton label="Continue" onPress={onSetPin} disabled={stage !== 'set_pin'} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
});
