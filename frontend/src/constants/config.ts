import Constants from 'expo-constants';

const PLACEHOLDER_HOST = '192.168.1.100';

const rawApiUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  `http://${PLACEHOLDER_HOST}:8180`;

export const API_BASE_URL = rawApiUrl.replace(/\/$/, '');

// BMONI sandbox test values (see backend/app/bmoni_client.py's own TEST_BVN/COUNTRY_NGA).
export const TEST_BVN = '22222222222';
export const COUNTRY_NGA = 'NGA';

if (__DEV__ && API_BASE_URL.includes(PLACEHOLDER_HOST)) {
  console.warn(
    `[config] EXPO_PUBLIC_API_URL is still the placeholder (${API_BASE_URL}). ` +
      'Set it in frontend/.env to your laptop\'s LAN IP before running on a device/emulator.'
  );
}
