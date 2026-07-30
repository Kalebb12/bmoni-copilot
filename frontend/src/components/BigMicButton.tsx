import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { PipelineStatus } from '@/hooks/useVoicePipeline';

const LABELS: Record<PipelineStatus, string> = {
  idle: 'Tap to speak',
  listening: 'Listening… tap to stop',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};

const HINTS: Record<PipelineStatus, string> = {
  idle: 'Double tap to start talking',
  listening: 'Recording. Double tap to stop, or wait for silence.',
  thinking: 'Working on it, please wait.',
  speaking: 'Playing the response.',
};

export function BigMicButton({
  status,
  onPress,
  disabled,
}: {
  status: PipelineStatus;
  onPress: () => void;
  disabled?: boolean;
}) {
  const isBusy = status === 'thinking' || status === 'speaking';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isBusy}
      accessibilityRole="button"
      accessibilityLabel={LABELS[status]}
      accessibilityHint={HINTS[status]}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: status === 'listening' ? '#D64545' : '#208AEF',
          opacity: pressed ? 0.85 : isBusy ? 0.6 : 1,
        },
      ]}>
      <View style={styles.inner}>
        <ThemedText type="title" style={[styles.icon, styles.onButtonText]}>
          {status === 'listening' ? '■' : '🎙'}
        </ThemedText>
        <ThemedText type="bodyBold" style={[styles.label, styles.onButtonText]}>
          {LABELS[status]}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 260,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  icon: {
    fontSize: 72,
    lineHeight: 80,
  },
  label: {
    textAlign: 'center',
  },
  onButtonText: {
    // Fixed white regardless of theme — this button always has a solid
    // colored background, so ThemedText's light/dark text color would go
    // black-on-blue in dark mode otherwise.
    color: '#ffffff',
  },
});
