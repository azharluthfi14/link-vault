import type { ComputedStatus, DbShortLinkStatus, ShortLink } from '../types';

export function isExpiredByDate(expiresAt?: Date | null) {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
}

export function isExpiredByClick(click: number, maxClick?: number) {
  if (!maxClick) return false;
  return click >= maxClick;
}

export function isShortLinkExpired(link: {
  status: DbShortLinkStatus;
  expiresAt?: Date | null;
  clicks: number;
  maxClicks?: number | null;
}) {
  if (link.status !== 'active') return false;

  if (link.expiresAt && new Date() > link.expiresAt) return true;
  if (link.maxClicks && link.clicks >= link.maxClicks) return true;

  return false;
}

export function computeShortLinkStatus(link: {
  status: ComputedStatus;
  expiresAt?: Date | null;
  clicks: number;
  maxClicks?: number | null;
}): ComputedStatus {
  if (link.status === 'disabled') return 'disabled';

  if (
    (link.expiresAt && new Date() > link.expiresAt) ||
    (link.maxClicks && link.clicks >= link.maxClicks)
  ) {
    return 'expired';
  }

  return 'active';
}

export function filterByStatus(
  shortLinks: ShortLink[],
  status?: ComputedStatus
) {
  if (!status) return shortLinks;

  return shortLinks.filter((link) => computeShortLinkStatus(link) === status);
}
