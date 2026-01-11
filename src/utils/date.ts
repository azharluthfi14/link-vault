import { parseAbsolute } from '@internationalized/date';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizeExpiresAt(raw: Record<string, any>) {
  if (typeof raw.expiresAt !== 'string' || !raw.expiresAt) return;

  const date = new Date(raw.expiresAt);
  if (!Number.isNaN(date.getTime())) {
    raw.expiresAt = date.toISOString();
  } else {
    delete raw.expiresAt;
  }
}

export function formatExpiresAt(iso: string) {
  const date = parseAbsolute(iso, 'Asia/Jakarta');

  return date.toDate().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
