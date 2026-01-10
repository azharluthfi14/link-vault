export enum ShortLinkErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  SLUG_ALREADY_EXISTS = 'SLUG_ALREADY_EXISTS',
  INVALID_STATUS = 'INVALID_STATUS',
  EXPIRED = 'EXPIRED',
  MAX_CLICKS_REACHED = 'MAX_CLICKS_REACHED',
  INVALID_URL = 'INVALID_URL',
}

export const ShortLinkErrorMessage: Record<ShortLinkErrorCode, string> = {
  NOT_FOUND: 'Short link not found',
  FORBIDDEN: 'You do not have permission to access this link',
  SLUG_ALREADY_EXISTS: 'This slug is already taken',
  INVALID_STATUS: 'Link status is invalid',
  EXPIRED: 'This link has expired',
  MAX_CLICKS_REACHED: 'This link has reached its maximum clicks',
  INVALID_URL: 'The provided URL is invalid',
};

export const ShortLinkErrorStatus: Record<ShortLinkErrorCode, number> = {
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  SLUG_ALREADY_EXISTS: 409,
  INVALID_STATUS: 410,
  EXPIRED: 410,
  MAX_CLICKS_REACHED: 410,
  INVALID_URL: 400,
};

export class ShortLinkError extends Error {
  public readonly statusCode: number;

  constructor(public readonly code: ShortLinkErrorCode) {
    super(ShortLinkErrorMessage[code]);
    this.name = 'ShortLinkError';
    this.statusCode = ShortLinkErrorStatus[code];
  }
}
