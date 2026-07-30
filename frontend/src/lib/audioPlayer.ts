import { createAudioPlayer, type AudioStatus } from 'expo-audio';
import { File, Paths } from 'expo-file-system';

// The backend's /voice/speak returns raw audio bytes, not a URI — expo-audio's
// player only loads from a file/asset/remote URL, so the bytes are written to
// a temp cache file first (confirmed via the expo-audio + expo-file-system
// docs: no data-URI support).
const FALLBACK_TIMEOUT_MS = 30_000;
let counter = 0;

/** Writes `audioBytes` to a temp file and plays it, resolving once playback finishes. */
export async function playRemoteSpeech(
  audioBytes: ArrayBuffer,
  extension: 'mp3' | 'wav' | 'opus' | 'flac' = 'mp3'
): Promise<void> {
  const file = new File(Paths.cache, `speak-${Date.now()}-${counter++}.${extension}`);
  file.create({ overwrite: true });
  file.write(new Uint8Array(audioBytes));

  return new Promise((resolve) => {
    const player = createAudioPlayer({ uri: file.uri });
    let settled = false;
    let fallback: ReturnType<typeof setTimeout>;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(fallback);
      subscription.remove();
      player.remove();
      try {
        file.delete();
      } catch {
        // best-effort cleanup, not worth surfacing to the user
      }
      resolve();
    };

    const subscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (status.didJustFinish || status.error) {
        finish();
      }
    });

    fallback = setTimeout(finish, FALLBACK_TIMEOUT_MS);
    player.play();
  });
}
