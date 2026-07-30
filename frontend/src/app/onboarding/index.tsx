import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBanner } from '@/components/ErrorBanner';
import { LabeledInput } from '@/components/LabeledInput';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/context/SessionContext';
import { TEST_BVN } from '@/constants/config';
import { Spacing } from '@/constants/theme';
import { api, ApiError } from '@/lib/api';
import { toNigerianE164 } from '@/lib/phone';

export default function OnboardingStart() {
  const { setBmoniUserId, setPhoneNumber: setSessionPhoneNumber } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = firstName.trim().length > 0 && email.trim().length > 0 && phoneNumber.trim().length > 0;

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { user } = await api.bmoni.createUser({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        email: email.trim(),
        phone_number: toNigerianE164(phoneNumber),
        bvn: TEST_BVN,
      });
      await setBmoniUserId(user.id);
      await setSessionPhoneNumber(phoneNumber.trim());
      await api.bmoni.activateKyc(user.id);
      router.replace('/onboarding/wallet');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong creating your account.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <LoadingOverlay label="Setting up your account…" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title">Let&apos;s set up your account</ThemedText>
        <ThemedText type="body">Tell us a little about yourself to get started.</ThemedText>

        {error && <ErrorBanner message={error} onRetry={onSubmit} />}

        <ThemedView style={styles.form}>
          <LabeledInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            textContentType="givenName"
          />
          <LabeledInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            textContentType="familyName"
          />
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <LabeledInput
            label="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
          />
        </ThemedView>

        <PrimaryButton label="Create my account" onPress={onSubmit} disabled={!canSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  form: {
    gap: Spacing.three,
  },
});
