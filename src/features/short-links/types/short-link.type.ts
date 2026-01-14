import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { linkStatusEnum, shortLinks } from '@/db/schemas';
import type { AuthErrorCode } from '@/libs/auth/auth-error';

import type { ShortLinkErrorCode } from '../errors';

export type ShortLink = InferSelectModel<typeof shortLinks>;
export type InsertShortLink = InferInsertModel<typeof shortLinks>;
export type ShortLinkStatus = (typeof linkStatusEnum.enumValues)[number];

export type LinkListParams = {
  userId: string;
  limit: number;
  offset: number;
  search?: string;
  status?: ShortLinkStatus;
};

export type ShortLinkListResponse = {
  items: ShortLink[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type LinkListParamsInput = Omit<LinkListParams, 'offset'> & {
  page?: number;
};

export interface ShortLinkRepository {
  create(
    data: Omit<InsertShortLink, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShortLink>;
  findById(id: string): Promise<ShortLink | null>;
  findByActiveSlug(slug: string): Promise<ShortLink | null>;
  update(id: string, data: Partial<InsertShortLink>): Promise<ShortLink | null>;
  slugExists(slug: string): Promise<boolean>;
  softDelete(id: string): Promise<void>;
  listByUser(params: LinkListParams): Promise<ShortLink[]>;
  incrementClicks(id: string): Promise<boolean>;
  countByUser(
    userId: string,
    search?: string,
    status?: ShortLinkStatus
  ): Promise<number>;
}

export type ShortLinkServiceDeps = {
  repo: ShortLinkRepository;
};

export type SuccessResultBase = {
  success: true;
  message: string;
};

export type SuccessWithData<T> = SuccessResultBase & {
  data: T;
};

export type SuccessNoData = SuccessResultBase & {
  data?: never;
};

export type ValidationErrorResult = {
  success: false;
  code: 'VALIDATION_ERROR';
  fieldErrors: Record<string, string[]>;
};

export type DomainErrorResult = {
  success: false;
  code: ShortLinkErrorCode | AuthErrorCode;
  message: string;
};

export type MutateResult<T> =
  | SuccessWithData<T>
  | SuccessNoData
  | ValidationErrorResult
  | DomainErrorResult;

export type MutateShortLinkResponse = MutateResult<ShortLink>;
