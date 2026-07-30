import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BigMicButton } from '@/components/BigMicButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useVoicePipeline } from '@/hooks/useVoicePipeline';

const WELCOME_TEXT = "Welcome back. Tap the microphone and tell me what you'd like to do — you can ask for your balance, your recent spending, or send money.";

export default function VoiceScreen() {
  const { status, lastSpokenText, error, onTapMic, stopListening, speakWelcome } = useVoicePipeline();
  const welcomedRef = useRef(false);

  useEffect(() => {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    speakWelcome(WELCOME_TEXT);
  }, [speakWelcome]);

  const onPressMic = () => {
    if (status === 'listening') {
      stopListening();
      return;
    }
    if (status === 'idle') {
      onTapMic();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.transcriptArea}>
          {error ? (
            <ErrorBanner message={error} />
          ) : (
            <ThemedText type="body" style={styles.transcript} accessibilityLiveRegion="polite">
              {lastSpokenText}
            </ThemedText>
          )}
        </ThemedView>

        <BigMicButton status={status} onPress={onPressMic} />

        {__DEV__ && (
          <Pressable
            onPress={() => router.push('/debug')}
            accessibilityRole="button"
            accessibilityLabel="Open debug screen">
            <ThemedText type="small" themeColor="textSecondary">
              Debug
            </ThemedText>
          </Pressable>
        )}
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
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  transcriptArea: {
    flex: 1,
    justifyContent: 'center',
  },
  transcript: {
    textAlign: 'center',
  },
});
