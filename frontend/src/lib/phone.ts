// BMONI requires E.164 (see backend/app/bmoni_client.py's create_user), but users
// naturally type Nigerian numbers in local format (0XXXXXXXXXX).
export function toNigerianE164(rawPhoneNumber: string): string {
  const digits = rawPhoneNumber.trim().replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}
