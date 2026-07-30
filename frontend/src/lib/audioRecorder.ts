import { useCallback, useEffect, useRef } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

// expo-audio has no built-in voice-activity/silence detection (confirmed
// against the SDK 57 docs), so auto-stop-on-silence is hand-rolled here by
// polling `metering` (dBFS) and watching for a sustained quiet stretch.
const SILENCE_THRESHOLD_DB = -40;
const SILENCE_HOLD_MS = 1500;
const MIN_RECORDING_MS = 600; // guards against a stray tap auto-stopping instantly
const METERING_POLL_MS = 100;

const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };

let audioModeConfigured = false;
async function ensureAudioMode() {
  if (audioModeConfigured) return;
  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  audioModeConfigured = true;
}

export type VoiceRecorderResult = {
  isRecording: boolean;
  /**
   * Starts recording and resolves with the local file URI once the recorder
   * auto-stops on silence (or `stopManually` is called) — or `null` if the
   * user denied microphone permission.
   */
  recordUntilSilence: () => Promise<string | null>;
  /** Ends the in-flight `recordUntilSilence` call early, e.g. on a second tap. */
  stopManually: () => void;
};

export function useVoiceRecorder(): VoiceRecorderResult {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const state = useAudioRecorderState(recorder, METERING_POLL_MS);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishRef = useRef<((uri: string | null) => void) | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  }, []);

  const finish = useCallback(async () => {
    clearSilenceTimer();
    const resolve = finishRef.current;
    if (!resolve) return;
    finishRef.current = null;
    let uri: string | null = null;
    if (stateRef.current.isRecording) {
      await recorder.stop();
      uri = recorder.uri;
    }
    resolve(uri);
  }, [clearSilenceTimer, recorder]);

  // Watches metering while a recordUntilSilence() call is in flight and
  // auto-stops after a sustained quiet stretch.
  useEffect(() => {
    if (!finishRef.current || state.durationMillis < MIN_RECORDING_MS) {
      return;
    }
    const metering = state.metering ?? 0;
    if (metering < SILENCE_THRESHOLD_DB) {
      if (!silenceTimer.current) {
        silenceTimer.current = setTimeout(finish, SILENCE_HOLD_MS);
      }
    } else {
      clearSilenceTimer();
    }
    return clearSilenceTimer;
  }, [state.metering, state.durationMillis, finish, clearSilenceTimer]);

  const recordUntilSilence = useCallback(async (): Promise<string | null> => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) return null;
    await ensureAudioMode();
    await recorder.prepareToRecordAsync();
    return new Promise<string | null>((resolve) => {
      finishRef.current = resolve;
      recorder.record();
    });
  }, [recorder]);

  const stopManually = useCallback(() => {
    finish();
  }, [finish]);

  return { isRecording: state.isRecording, recordUntilSilence, stopManually };
}
