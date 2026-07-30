import * as LocalAuthentication from 'expo-local-authentication';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SessionProvider } from '@/context/SessionContext';
import { Spacing } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

type LockState = 'checking' | 'locked' | 'unlocked' | 'no-secure-auth';

function UnlockGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LockState>('checking');

  useEffect(() => {
    (async () => {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      setState(hasHardware && isEnrolled ? 'locked' : 'no-secure-auth');
      SplashScreen.hideAsync();
    })();
  }, []);

  const unlock = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock your account',
      // false lets the OS present the device passcode automatically when
      // biometrics fail or aren't enrolled — no custom passcode UI needed.
      disableDeviceFallback: false,
    });
    if (result.success) setState('unlocked');
  };

  if (state === 'checking') return null;

  if (state === 'unlocked') return <>{children}</>;

  if (state === 'no-secure-auth') {
    return (
      <ThemedView style={styles.gate}>
        <ThemedText type="subtitle" style={styles.center}>
          No secure unlock is available on this device
        </ThemedText>
        <ThemedText type="body" style={styles.center}>
          Set up a fingerprint, face unlock, or device passcode for the best protection. You can still continue for
          now.
        </ThemedText>
        <Pressable
          onPress={() => setState('unlocked')}
          accessibilityRole="button"
          accessibilityLabel="Continue without secure unlock"
          style={styles.button}>
          <ThemedText type="bodyBold" style={styles.buttonText}>
            Continue
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.gate}>
      <ThemedText type="title" style={styles.center}>
        🔒
      </ThemedText>
      <ThemedText type="subtitle" style={styles.center}>
        Your account is locked
      </ThemedText>
      <Pressable onPress={unlock} accessibilityRole="button" accessibilityLabel="Unlock" style={styles.button}>
        <ThemedText type="bodyBold" style={styles.buttonText}>
          Unlock
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <UnlockGate>
          <Stack screenOptions={{ headerShown: false }} />
        </UnlockGate>
      </SessionProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  center: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#208AEF',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.four,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
});
