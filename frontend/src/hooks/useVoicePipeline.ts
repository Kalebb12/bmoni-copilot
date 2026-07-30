import { useCallback, useEffect, useRef, useState } from 'react';

import { useSession } from '@/context/SessionContext';
import { api, ApiError, type InterpretResponse, type TransferConfirmResponse, type TransferPrepareResponse } from '@/lib/api';
import { playRemoteSpeech } from '@/lib/audioPlayer';
import { useVoiceRecorder } from '@/lib/audioRecorder';
import { PIN_LENGTH, signPayoutHash } from '@/lib/bmoniSdk';
import { extractDigitsFromTranscript, isValidPinLength } from '@/lib/pinWords';
import { findBankByName, findBestNameMatch, isAffirmative } from '@/lib/speechHelpers';

export type PipelineStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

const FOLLOW_UP_MAX_ATTEMPTS = 3;

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export function useVoicePipeline() {
  const { bmoniUserId, sourceSmartWalletId } = useSession();
  const recorder = useVoiceRecorder();
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  const speakText = useCallback(async (text: string) => {
    setStatus('speaking');
    setLastSpokenText(text);
    try {
      const bytes = await api.speak(text);
      await playRemoteSpeech(bytes);
    } catch (err) {
      // A failed TTS call shouldn't crash the flow — the text is still on screen.
      console.log('[voice] speak failed, continuing silently', err);
    }
  }, []);

  const listen = useCallback(async (): Promise<string> => {
    setStatus('listening');
    const uri = await recorder.recordUntilSilence();
    if (!uri) return '';
    setStatus('thinking');
    try {
      const { transcript } = await api.transcribeAudio(uri);
      return transcript.trim();
    } catch (err) {
      setError(errorMessage(err, 'Could not understand that.'));
      return '';
    }
  }, [recorder]);

  const ask = useCallback(
    async (prompt: string): Promise<string> => {
      await speakText(prompt);
      return listen();
    },
    [speakText, listen]
  );

  // --- Transfer sub-flow --------------------------------------------------

  const runTransferFlow = useCallback(
    async (entities: InterpretResponse) => {
      if (!bmoniUserId || !sourceSmartWalletId) {
        await speakText('Your account is not fully set up yet. Please finish setup first.');
        return;
      }

      let contactId: string | undefined;
      let bankCode: string | undefined;
      let bankName: string | undefined;
      let accountNumber: string | undefined;
      let recipientLabel = entities.recipient_name ?? '';
      let savedAsContact = true; // only false when we fall through to raw account+bank

      if (entities.recipient_name) {
        const lookup = await api.contacts.lookup(bmoniUserId, entities.recipient_name);
        if (lookup.status === 'matched' && lookup.contact) {
          contactId = lookup.contact.id;
          recipientLabel = lookup.contact.display_name;
        } else if (lookup.status === 'clarification_needed' && lookup.candidates?.length) {
          const names = lookup.candidates.map((c) => c.display_name).join(', ');
          const reply = await ask(`I found more than one contact: ${names}. Who did you mean?`);
          const match = findBestNameMatch(reply, lookup.candidates);
          if (!match) {
            await speakText("I still couldn't tell which contact you meant. Let's try that again.");
            return;
          }
          contactId = match.id;
          recipientLabel = match.display_name;
        }
      }

      if (!contactId) {
        savedAsContact = false;
        const acctReply = await ask(
          `I don't have ${recipientLabel || 'that person'} saved yet. Please say their account number.`
        );
        const digits = acctReply.replace(/\D/g, '');
        if (digits.length < 10) {
          await speakText("I couldn't catch a valid account number. Let's try that transfer again.");
          return;
        }
        accountNumber = digits;

        let banks: { code: string; name: string }[] = [];
        try {
          const banksResp = await api.bmoni.nigerianBanks(bmoniUserId);
          banks = (banksResp.banks as { code: string; name: string }[]) ?? [];
        } catch (err) {
          await speakText(errorMessage(err, "I couldn't look up Nigerian banks right now."));
          return;
        }

        const bankReply = await ask('Which bank is that?');
        const bank = findBankByName(bankReply, banks);
        if (!bank) {
          await speakText("I couldn't find that bank. Let's try that transfer again.");
          return;
        }
        bankCode = bank.code;
        bankName = bank.name;
      }

      const amount = entities.amount ? Number(entities.amount) : NaN;
      if (!amount || Number.isNaN(amount) || amount <= 0) {
        await speakText("I didn't catch how much to send. Let's try that transfer again.");
        return;
      }

      let prepared: TransferPrepareResponse;
      try {
        prepared = await api.transfer.prepare({
          user_id: bmoniUserId,
          source_smart_wallet_id: sourceSmartWalletId,
          amount_ngn: amount,
          recipient_name: contactId ? undefined : recipientLabel,
          contact_id: contactId,
          account_number: accountNumber,
          bank_code: bankCode,
        });
      } catch (err) {
        await speakText(errorMessage(err, 'Something went wrong preparing that transfer.'));
        return;
      }

      if (prepared.status === 'clarification_needed') {
        await speakText(prepared.summary);
        return;
      }

      if (prepared.warning) {
        const warnReply = await ask(`${prepared.warning} Do you still want to continue?`);
        if (!isAffirmative(warnReply)) {
          await speakText('Okay, I have cancelled that transfer.');
          return;
        }
      }

      const confirmReply = await ask(`${prepared.summary} Say yes to confirm.`);
      if (!isAffirmative(confirmReply)) {
        await speakText('Okay, I have cancelled that transfer.');
        return;
      }

      const transferId = prepared.transfer_id as string;
      let confirmed: TransferConfirmResponse | null = null;
      let confirmedPin = '';

      for (let attempt = 0; attempt < FOLLOW_UP_MAX_ATTEMPTS; attempt++) {
        const pinReply = await ask(attempt === 0 ? 'Please say your PIN.' : "That PIN wasn't right. Please say your PIN again.");
        const digits = extractDigitsFromTranscript(pinReply);
        if (!isValidPinLength(digits, PIN_LENGTH)) {
          await speakText(`Please say a ${PIN_LENGTH}-digit PIN.`);
          continue;
        }
        try {
          confirmed = await api.transfer.confirm(transferId, digits);
        } catch (err) {
          await speakText(errorMessage(err, 'Something went wrong confirming that transfer.'));
          return;
        }
        if (confirmed.status === 'invalid_pin') continue;
        confirmedPin = digits;
        break;
      }

      if (!confirmed || confirmed.status === 'invalid_pin') {
        await speakText("I couldn't verify your PIN. Please try that transfer again.");
        return;
      }

      if (confirmed.status !== 'completed') {
        await speakText(confirmed.message);
        return;
      }

      // BMONI's payout call returns a signatureRequest — the transfer isn't
      // on-chain until this device signs it. See backend/README.md's note on
      // /transfer/confirm for why this hop exists.
      const signatureRequest = confirmed.bmoni_result?.signatureRequest as
        | { hashToSign?: string; workflowId?: string }
        | undefined;

      if (signatureRequest?.hashToSign && signatureRequest.workflowId) {
        try {
          const signature = await signPayoutHash(signatureRequest.hashToSign, confirmedPin);
          // The sandbox's payout signatureRequest is keyed by workflowId, not
          // proposalId (see backend README's note on this endpoint) — reusing
          // the proposals/sign proxy with workflowId in place of proposalId,
          // matching the backend's own documented best-effort assumption here.
          await api.bmoni.submitProposalSignature(bmoniUserId, signatureRequest.workflowId, { signature });
        } catch (err) {
          await speakText(
            err instanceof Error
              ? `Your PIN was right, but I could not finish signing this on your device: ${err.message}`
              : 'Your PIN was right, but I could not finish signing this on your device.'
          );
          return;
        }
      }

      await speakText(confirmed.message);

      if (!savedAsContact && recipientLabel && accountNumber && bankCode) {
        const saveReply = await ask(`Should I save this as ${recipientLabel} for next time?`);
        if (isAffirmative(saveReply)) {
          try {
            await api.contacts.create({
              user_id: bmoniUserId,
              name: recipientLabel,
              account_number: accountNumber,
              bank_code: bankCode,
              bank_name: bankName,
            });
            await speakText(`Saved ${recipientLabel}.`);
          } catch (err) {
            await speakText(errorMessage(err, "I couldn't save that contact."));
          }
        }
      }
    },
    [bmoniUserId, sourceSmartWalletId, ask, speakText]
  );

  // --- Dispatch ------------------------------------------------------------

  const dispatch = useCallback(
    async (entities: InterpretResponse) => {
      if (!bmoniUserId) {
        await speakText('Your account is not set up yet.');
        return;
      }

      switch (entities.intent) {
        case 'balance_check': {
          try {
            const balances = await api.bmoni.balances(bmoniUserId);
            const { text } = await api.respond(balances, 'balance_check');
            await speakText(text);
          } catch (err) {
            await speakText(errorMessage(err, "I couldn't check your balance right now."));
          }
          return;
        }
        case 'spending_summary': {
          if (!sourceSmartWalletId) {
            await speakText('Your account is not fully set up yet.');
            return;
          }
          try {
            const transactions = await api.bmoni.transactions(bmoniUserId, sourceSmartWalletId);
            const { text } = await api.respond(transactions, 'spending_summary');
            await speakText(text);
          } catch (err) {
            await speakText(errorMessage(err, "I couldn't get your recent transactions right now."));
          }
          return;
        }
        case 'transfer':
          await runTransferFlow(entities);
          return;
        case 'contact_save':
          // Only reachable as part of the post-transfer save prompt in
          // runTransferFlow — there's no standalone "save a contact" voice
          // command in the spec.
          await speakText("You can save a contact right after sending them money for the first time.");
          return;
        default:
          await speakText("Sorry, I didn't understand that. You can ask for your balance or send money.");
      }
    },
    [bmoniUserId, sourceSmartWalletId, runTransferFlow, speakText]
  );

  // --- Main loop -------------------------------------------------------------

  // runTurn calls itself recursively for the auto-reopened follow-up mic —
  // routed through a ref (kept in sync via the effect below) rather than a
  // direct self-reference, so an in-flight recursive call always resolves
  // to the latest closure instead of one captured before its deps changed.
  const runTurnRef = useRef<((transcript: string) => Promise<void>) | null>(null);

  const runTurn = useCallback(
    async (transcript: string) => {
      busyRef.current = true;
      setError(null);
      try {
        const entities = await api.interpret(transcript);
        await dispatch(entities);
      } catch (err) {
        await speakText(errorMessage(err, 'Sorry, something went wrong. Please try again.'));
      } finally {
        busyRef.current = false;
      }

      // Reopen the mic for a natural follow-up without requiring another tap.
      const followUp = await listen();
      if (followUp) {
        await runTurnRef.current?.(followUp);
      } else {
        setStatus('idle');
      }
    },
    [dispatch, listen, speakText]
  );

  useEffect(() => {
    runTurnRef.current = runTurn;
  }, [runTurn]);

  const speakWelcome = useCallback(
    async (text: string) => {
      await speakText(text);
      setStatus('idle');
    },
    [speakText]
  );

  const onTapMic = useCallback(async () => {
    if (busyRef.current) return;
    const transcript = await listen();
    if (transcript) {
      await runTurn(transcript);
    } else {
      setStatus('idle');
    }
  }, [listen, runTurn]);

  return {
    status,
    lastSpokenText,
    error,
    isRecording: recorder.isRecording,
    onTapMic,
    stopListening: recorder.stopManually,
    speakWelcome,
  };
}
