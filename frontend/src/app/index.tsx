import { Redirect } from 'expo-router';

import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useSession } from '@/context/SessionContext';

export default function Index() {
  const { loading, onboardingComplete } = useSession();

  if (loading) {
    return <LoadingOverlay label="Loading your account…" />;
  }

  return <Redirect href={onboardingComplete ? '/voice' : '/onboarding'} />;
}
