import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSession } from '@/context/SessionContext';
import { Spacing } from '@/constants/theme';
import { api, ApiError } from '@/lib/api';

// Manual endpoint tester — hits the backend with fixed test data so the
// backend can be verified reachable/working before wiring up the full voice
// pipeline (per the spec's own testing ask). Every call already logs its
// request/response pair to the console via api.ts. Dev-only (see voice.tsx's
// __DEV__ gated link).
type Action = { label: string; run: (userId: string, walletId: string | null) => Promise<unknown> };

const ACTIONS: Action[] = [
  { label: 'Health check', run: () => api.health() },
  {
    label: 'Balances',
    run: (userId) => api.bmoni.balances(userId),
  },
  {
    label: 'Wallets',
    run: (userId) => api.bmoni.wallets(userId),
  },
  {
    label: 'Transactions (source wallet)',
    run: (userId, walletId) => {
      if (!walletId) throw new Error('No source smart wallet on this device yet.');
      return api.bmoni.transactions(userId, walletId);
    },
  },
  { label: 'Nigerian banks', run: (userId) => api.bmoni.nigerianBanks(userId) },
  { label: 'List contacts', run: (userId) => api.contacts.list(userId) },
  {
    label: 'Create test contact',
    run: (userId) =>
      api.contacts.create({
        user_id: userId,
        name: 'Debug Contact',
        account_number: '0123456789',
        bank_code: '058',
        bank_name: 'GTBank',
        label: `${Date.now()}`,
      }),
  },
  { label: 'Contact lookup ("Debug")', run: (userId) => api.contacts.lookup(userId, 'Debug') },
  {
    label: 'Transfer prepare (₦100 to test account)',
    run: (userId, walletId) => {
      if (!walletId) throw new Error('No source smart wallet on this device yet.');
      return api.transfer.prepare({
        user_id: userId,
        source_smart_wallet_id: walletId,
        amount_ngn: 100,
        recipient_name: 'Debug Contact',
        account_number: '0123456789',
        bank_code: '058',
      });
    },
  },
];

export default function DebugScreen() {
  const { bmoniUserId, sourceSmartWalletId } = useSession();
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<string>('Tap an action above to see its result here.');

  const runAction = async (action: Action) => {
    if (!bmoniUserId && action.label !== 'Health check') {
      setResult('No bmoniUserId on this device yet — finish onboarding first.');
      return;
    }
    setRunning(action.label);
    try {
      const data = await action.run(bmoniUserId ?? '', sourceSmartWalletId);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(err instanceof ApiError ? `[${err.status}] ${err.message}` : String(err));
    } finally {
      setRunning(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Debug</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          user_id: {bmoniUserId ?? 'none'} · wallet: {sourceSmartWalletId ?? 'none'}
        </ThemedText>

        <ThemedView style={styles.actions}>
          {ACTIONS.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => runAction(action)}
              disabled={running !== null}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              style={({ pressed }) => [styles.actionButton, { opacity: pressed || running ? 0.7 : 1 }]}>
              <ThemedText type="smallBold">{running === action.label ? 'Running…' : action.label}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.resultBox}>
          <ThemedText type="code">{result}</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  resultBox: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
});
