import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@/libs/errors/base.error';

export class ShortLinkExpiredError extends AppError {
  readonly code = 'SHORT_LINK_EXPIRED';
  readonly statusCode = 410;

  constructor(id: string) {
    super(`Short link '${id}' has expired`, { id });
  }
}

export class MaxClicksReachedError extends AppError {
  readonly code = 'MAX_CLICKS_REACHED';
  readonly statusCode = 410;

  constructor(id: string) {
    super(`Short link has reached maximum clicks`, { id });
  }
}

export class ReservedSlugError extends AppError {
  readonly code = 'RESERVED_SLUG';
  readonly statusCode = 403;

  constructor(slug: string) {
    super(`Slug is reserved`, { slug });
  }
}

export class InvalidStatusShortLink extends AppError {
  readonly code = 'INVALID_STATUS';
  readonly statusCode = 401;

  constructor(status: string) {
    super(`Short link status invalid `, { status });
  }
}

export class DisabledStatusShortLink extends AppError {
  readonly code = 'SHORT_LINK_DISABLED';
  readonly statusCode = 401;

  constructor(id: string) {
    super(`Short link status disabled `, { id });
  }
}

export class CannotEnabledExpiredShortLink extends AppError {
  readonly code = 'CANNOT_ENABLED_EXPIRED_SHORT_LINK';
  readonly statusCode = 401;

  constructor(id: string) {
    super(`Cannot enable expired short link`, { id });
  }
}

export const ShortLinkErrors = {
  notFound: (id?: string) => new NotFoundError(`Short link ${id}  not found`),
  forbidden: () =>
    new ForbiddenError('You do not have permission to access this link'),
  slugExists: (slug: string) =>
    new ConflictError(`Slug '${slug}' already exists`, 'slug'),
  invalidUrl: (url: string) => new BadRequestError(`Invalid URL: ${url}`),
  expired: (id: string) => new ShortLinkExpiredError(id),
  maxClicks: (slug: string) => new MaxClicksReachedError(slug),
  reservedSlug: (slug: string) => new ReservedSlugError(slug),
  invalidStatus: (status: string) => new InvalidStatusShortLink(status),
  disabledShortLink: (id: string) => new DisabledStatusShortLink(id),
  cannotEnableExpired: (id: string) => new CannotEnabledExpiredShortLink(id),
};
