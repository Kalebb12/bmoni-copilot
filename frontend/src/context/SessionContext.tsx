import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  loadSession,
  markOnboardingComplete,
  saveBmoniUserId,
  saveOwnerWalletAddress,
  savePhoneNumber,
  saveSourceSmartWalletId,
  type SessionRecord,
} from '@/lib/storage';

type SessionState = SessionRecord & { loading: boolean };

type SessionContextValue = SessionState & {
  setBmoniUserId: (id: string) => Promise<void>;
  setPhoneNumber: (phoneNumber: string) => Promise<void>;
  setOwnerWalletAddress: (address: string) => Promise<void>;
  setSourceSmartWalletId: (id: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    loading: true,
    bmoniUserId: null,
    phoneNumber: null,
    ownerWalletAddress: null,
    sourceSmartWalletId: null,
    onboardingComplete: false,
  });

  useEffect(() => {
    loadSession().then((session) => setState({ ...session, loading: false }));
  }, []);

  const setBmoniUserId = useCallback(async (id: string) => {
    await saveBmoniUserId(id);
    setState((prev) => ({ ...prev, bmoniUserId: id }));
  }, []);

  const setPhoneNumber = useCallback(async (phoneNumber: string) => {
    await savePhoneNumber(phoneNumber);
    setState((prev) => ({ ...prev, phoneNumber }));
  }, []);

  const setOwnerWalletAddress = useCallback(async (address: string) => {
    await saveOwnerWalletAddress(address);
    setState((prev) => ({ ...prev, ownerWalletAddress: address }));
  }, []);

  const setSourceSmartWalletId = useCallback(async (id: string) => {
    await saveSourceSmartWalletId(id);
    setState((prev) => ({ ...prev, sourceSmartWalletId: id }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    await markOnboardingComplete();
    setState((prev) => ({ ...prev, onboardingComplete: true }));
  }, []);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        setBmoniUserId,
        setPhoneNumber,
        setOwnerWalletAddress,
        setSourceSmartWalletId,
        completeOnboarding,
      }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
