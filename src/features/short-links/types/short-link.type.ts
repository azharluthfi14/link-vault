import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { linkStatusEnum, shortLinks } from '@/db/schemas';

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
  incrementClicks(id: string): Promise<void>;
  countByUser(
    userId: string,
    search?: string,
    status?: ShortLinkStatus
  ): Promise<number>;
}

export type ShortLinkServiceDeps = {
  repo: ShortLinkRepository;
};
