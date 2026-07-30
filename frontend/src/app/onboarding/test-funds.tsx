import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/context/SessionContext';
import { Spacing } from '@/constants/theme';

export default function TestFunds() {
  const { phoneNumber, completeOnboarding } = useSession();

  const onDone = async () => {
    await completeOnboarding();
    router.replace('/voice');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Almost done!</ThemedText>
        <ThemedText type="body">
          Read this phone number out loud to hackathon staff so they can add test funds to your account:
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.phoneBox}>
          <ThemedText type="title" accessibilityLabel={`Phone number ${phoneNumber ?? 'not available'}`}>
            {phoneNumber ?? '—'}
          </ThemedText>
        </ThemedView>
        <PrimaryButton label="I'm ready, continue" onPress={onDone} />
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
    justifyContent: 'center',
  },
  phoneBox: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
  },
});
