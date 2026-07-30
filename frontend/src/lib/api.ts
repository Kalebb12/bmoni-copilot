// One function per backend route (see backend/README.md's "API surface").
// Every call logs its request/response pair to the console (spec requirement)
// with `pin` redacted; the backend's own API key never reaches this file at
// all, so there's nothing else sensitive to scrub.
import { API_BASE_URL } from '@/constants/config';

export type Intent = 'balance_check' | 'transfer' | 'spending_summary' | 'contact_save' | 'unknown';

export interface InterpretResponse {
  intent: Intent;
  amount: string | null;
  recipient_name: string | null;
  account_number: string | null;
  bank_name: string | null;
  contact_label: string | null;
  confidence: 'high' | 'medium' | 'low';
}

export interface ContactOut {
  id: string;
  name: string;
  label: string | null;
  display_name: string;
  account_number: string;
  bank_code: string;
  bank_name: string | null;
  created_at: string;
}

export interface ContactLookupResponse {
  status: 'matched' | 'ambiguous' | 'clarification_needed' | 'none';
  contact: ContactOut | null;
  candidates: ContactOut[] | null;
}

export interface TransferPrepareResponse {
  status: 'ready' | 'clarification_needed';
  transfer_id: string | null;
  requires_confirmation: boolean;
  warning: string | null;
  summary: string;
  candidates: ContactOut[] | null;
}

export interface TransferConfirmResponse {
  status: 'completed' | 'failed' | 'expired' | 'invalid_pin';
  message: string;
  bmoni_result: Record<string, any> | null;
}

export interface OwnerProofChallengeResponse {
  challengeId: string;
  groupId: string;
  message: string;
  expiresAt: string;
}

export interface SmartWalletDetail {
  id: string;
  currency: string;
  walletAddress: string | null;
  isActive: boolean;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;
type JsonBody = Record<string, unknown> | undefined;

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function redact<T>(value: T): T {
  if (!value || typeof value !== 'object') return value;
  const clone: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  if ('pin' in clone) clone.pin = '[redacted]';
  return clone as T;
}

function extractErrorMessage(data: unknown): string | null {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (obj.detail && typeof obj.detail === 'object') {
      const detail = obj.detail as Record<string, unknown>;
      if (typeof detail.message === 'string') return detail.message;
    }
    if (typeof obj.detail === 'string') return obj.detail;
  }
  return null;
}

async function requestJson<T>(
  method: string,
  path: string,
  opts: { params?: QueryParams; json?: JsonBody; body?: BodyInit } = {}
): Promise<T> {
  const url = buildUrl(path, opts.params);
  console.log(`[api] -> ${method} ${url}`, redact(opts.json ?? opts.params));

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: opts.json ? { 'content-type': 'application/json' } : undefined,
      body: opts.json ? JSON.stringify(opts.json) : opts.body,
    });
  } catch (err) {
    console.log(`[api] xx ${method} ${url} — network error`, err);
    throw new ApiError('Could not reach the server. Check your Wi-Fi and try again.', 0, null);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  console.log(`[api] <- ${response.status} ${method} ${url}`, redact(data));

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data) ?? `Request failed (${response.status})`, response.status, data);
  }
  return data as T;
}

// --- Voice --------------------------------------------------------------

async function transcribeAudio(fileUri: string): Promise<{ transcript: string }> {
  const form = new FormData();
  // React Native's fetch FormData accepts this {uri,name,type} shape for
  // multipart file uploads (there's no Blob available from a file:// URI).
  form.append('file', { uri: fileUri, name: 'audio.m4a', type: 'audio/m4a' } as unknown as Blob);
  return requestJson('POST', '/voice/transcribe', { body: form });
}

async function speak(
  text: string,
  opts: { voice?: string; response_format?: 'mp3' | 'wav' | 'opus' | 'flac' } = {}
): Promise<ArrayBuffer> {
  const url = buildUrl('/voice/speak');
  console.log(`[api] -> POST ${url}`, { text, ...opts });
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, ...opts }),
    });
  } catch (err) {
    console.log(`[api] xx POST ${url} — network error`, err);
    throw new ApiError('Could not reach the server. Check your Wi-Fi and try again.', 0, null);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    console.log(`[api] <- ${response.status} POST ${url}`, data);
    throw new ApiError(extractErrorMessage(data) ?? `Request failed (${response.status})`, response.status, data);
  }
  console.log(`[api] <- ${response.status} POST ${url} (audio bytes)`);
  return response.arrayBuffer();
}

// --- Agent ----------------------------------------------------------------

const interpret = (transcript: string, conversation_state?: Record<string, unknown>) =>
  requestJson<InterpretResponse>('POST', '/agent/interpret', { json: { transcript, conversation_state } });

const respond = (bmoni_result: Record<string, unknown>, intent?: Intent, context?: Record<string, unknown>) =>
  requestJson<{ text: string }>('POST', '/agent/respond', { json: { bmoni_result, intent, context } });

// --- Contacts ---------------------------------------------------------------

const contacts = {
  list: (userId: string) => requestJson<ContactOut[]>('GET', '/contacts', { params: { user_id: userId } }),
  lookup: (userId: string, query: string) =>
    requestJson<ContactLookupResponse>('GET', '/contacts/lookup', { params: { user_id: userId, query } }),
  create: (payload: {
    user_id: string;
    name: string;
    account_number: string;
    bank_code: string;
    bank_name?: string;
    label?: string;
  }) => requestJson<ContactOut>('POST', '/contacts', { json: payload }),
  get: (contactId: string, userId: string) =>
    requestJson<ContactOut>('GET', `/contacts/${contactId}`, { params: { user_id: userId } }),
  update: (
    contactId: string,
    userId: string,
    payload: Partial<{ name: string; account_number: string; bank_code: string; bank_name: string; label: string }>
  ) => requestJson<ContactOut>('PUT', `/contacts/${contactId}`, { params: { user_id: userId }, json: payload }),
  remove: (contactId: string, userId: string) =>
    requestJson<void>('DELETE', `/contacts/${contactId}`, { params: { user_id: userId } }),
};

// --- Transfers ----------------------------------------------------------------

const transfer = {
  prepare: (payload: {
    user_id: string;
    source_smart_wallet_id: string;
    amount_ngn: number;
    recipient_name?: string;
    contact_id?: string;
    account_number?: string;
    bank_code?: string;
    note?: string;
  }) => requestJson<TransferPrepareResponse>('POST', '/transfer/prepare', { json: payload }),
  confirm: (transfer_id: string, pin: string) =>
    requestJson<TransferConfirmResponse>('POST', '/transfer/confirm', { json: { transfer_id, pin } }),
};

const setPin = (userId: string, pin: string) =>
  requestJson<{ ok: boolean }>('POST', `/users/${userId}/pin`, { params: { pin } });

// --- BMONI proxies --------------------------------------------------------

const bmoni = {
  balances: (userId: string) => requestJson<Record<string, unknown>>('GET', `/bmoni/users/${userId}/balances`),
  wallets: (userId: string) => requestJson<Record<string, unknown>[]>('GET', `/bmoni/users/${userId}/wallets`),
  transactions: (userId: string, smartWalletId: string) =>
    requestJson<Record<string, unknown>>('GET', `/bmoni/users/${userId}/transactions/${smartWalletId}`),
  nigerianBanks: (userId: string) =>
    requestJson<{ banks?: { code: string; name: string }[]; [key: string]: unknown }>(
      'GET',
      `/bmoni/users/${userId}/nigerian-banks`
    ),
  verifyNigerianAccount: (userId: string, bankCode: string, accountNumber: string) =>
    requestJson<{ accountNumber: string; bankCode: string; bankName: string; accountName: string }>(
      'POST',
      `/bmoni/users/${userId}/verify-nigerian-account`,
      { params: { bank_code: bankCode, account_number: accountNumber } }
    ),
  createUser: (payload: { first_name: string; email: string; phone_number: string; bvn?: string; last_name?: string }) =>
    // BMONI's response is { user: { id, ... } }, not a bare { id }.
    requestJson<{ user: { id: string; [key: string]: unknown } }>('POST', '/bmoni/users', { params: payload }),
  onboardingStatus: (userId: string) =>
    requestJson<Record<string, unknown>>('GET', `/bmoni/users/${userId}/onboarding/status`),
  activateKyc: (userId: string, sumsubLevelName = 'id-and-liveness') =>
    requestJson<Record<string, unknown>>('POST', `/bmoni/users/${userId}/kyc/activate`, {
      params: { sumsub_level_name: sumsubLevelName },
    }),
  startNigeriaOnboarding: (userId: string, ngnWalletAddress: string, ngnWalletIndex: number, bvn?: string) =>
    requestJson<Record<string, unknown>>('POST', `/bmoni/users/${userId}/onboarding/start-nigeria`, {
      params: { ngn_wallet_address: ngnWalletAddress, ngn_wallet_index: ngnWalletIndex, bvn },
    }),
  ownerProofChallenge: (userId: string, currency: string, userOwnerAddress: string) =>
    requestJson<OwnerProofChallengeResponse>('POST', `/bmoni/users/${userId}/smart-wallets/owner-proof-challenge`, {
      params: { currency, user_owner_address: userOwnerAddress },
    }),
  createManagedSmartWallet: (
    userId: string,
    currency: string,
    userOwnerAddress: string,
    ownerProofChallengeId: string,
    ownerProofSignature: string
  ) =>
    requestJson<SmartWalletDetail>('POST', `/bmoni/users/${userId}/smart-wallets/create-managed`, {
      params: {
        currency,
        user_owner_address: userOwnerAddress,
        owner_proof_challenge_id: ownerProofChallengeId,
        owner_proof_signature: ownerProofSignature,
      },
    }),
  submitProposalSignature: (userId: string, proposalId: string, signaturePayload: Record<string, unknown>) =>
    requestJson<Record<string, unknown>>(
      'POST',
      `/bmoni/users/${userId}/smart-wallets/proposals/${proposalId}/sign`,
      { json: signaturePayload }
    ),
};

export const api = {
  health: () => requestJson<{ status: string }>('GET', '/health'),
  transcribeAudio,
  speak,
  interpret,
  respond,
  contacts,
  transfer,
  setPin,
  bmoni,
};
