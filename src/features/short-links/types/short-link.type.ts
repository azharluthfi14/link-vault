import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import type { linkStatusEnum, shortLinks } from '@/db/schemas';

export type ComputedStatus = 'active' | 'disabled' | 'expired';

export type ShortLink = InferSelectModel<typeof shortLinks>;
export type InsertShortLink = InferInsertModel<typeof shortLinks>;
export type DbShortLinkStatus = (typeof linkStatusEnum.enumValues)[number];

export type LinkListParams = {
  userId: string;
  limit: number;
  offset: number;
  search?: string;
  status?: ComputedStatus;
};

export type LinkListRepoParams = {
  userId: string;
  limit: number;
  offset: number;
  search?: string;
  status?: DbShortLinkStatus;
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

export type ShortLinkSummary = {
  totalLinks: number;
  activeLinks: number;
  disabledLinks: number;
  expiredLinks: number;
  totalClicks: number;
  clicksChart: { date: string; clicks: number }[];
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
    status?: DbShortLinkStatus
  ): Promise<number>;
  sumClicks(userId: string): Promise<number>;
  getClicksGroupedByDay(
    userId: string,
    days: number
  ): Promise<{ date: string; clicks: number }[]>;
  countInactiveLinkByUser(userId: string): Promise<number>;
  changeStatus(shortLinkId: string, status: DbShortLinkStatus): Promise<void>;
}

export type ShortLinkServiceDeps = {
  repo: ShortLinkRepository;
};
