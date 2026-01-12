import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { linkStatusEnum, shortLinks } from '@/db/schemas';

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

export type MutateShortLinkResult =
  | {
      success: true;
      data: ShortLink;
      message: string;
    }
  | {
      success: false;
      code: 'VALIDATION_ERROR';
      fieldErrors: Record<string, string[]>;
    }
  | {
      success: false;
      code: ShortLinkErrorCode;
      message: string;
    };

export type DeleteShortLinkResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      code: ShortLinkErrorCode;
      message: string;
    };
