module.exports = {
  expo: {
    name: 'frontend',
    slug: 'frontend',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'frontend',
    userInterfaceStyle: 'automatic',
    ios: {
      icon: './assets/expo.icon',
      infoPlist: {
        NSFaceIDUsageDescription: 'Unlock your account with Face ID instead of typing a passcode.',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      package: 'bmoni.copilot',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Unlock your account with Face ID instead of typing a passcode.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'c18b1380-80b4-48d2-aca7-65105b2122b7',
      },
      // Fallback used only if EXPO_PUBLIC_API_URL isn't set at build time.
      // Prefer the env var (see .env) — this constant is not read directly
      // by app code, src/constants/config.ts reads process.env first.
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.100:8180',
    },
  },
};
