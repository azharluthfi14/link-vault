import { nanoid } from 'nanoid';

import { RESERVED_ROUTES } from '@/constants';

import { ShortLinkErrors } from '../errors';
import type {
  CreateShortLinkSchemaInput,
  UpdateShortLinkSchemaInput,
} from '../schemas';
import type {
  DbShortLinkStatus,
  LinkListParamsInput,
  ShortLink,
  ShortLinkRepository,
  ShortLinkServiceDeps,
} from '../types';
import { computeShortLinkStatus, isShortLinkExpired } from '../utils';

export class ShortLinkServices {
  private readonly repo: ShortLinkRepository;

  constructor(deps: ShortLinkServiceDeps) {
    this.repo = deps.repo;
  }

  private computeStatus(link: ShortLink, input: UpdateShortLinkSchemaInput) {
    const expiresAt = input.expiresAt ?? link.expiresAt;
    const maxClicks = input.maxClicks ?? link.maxClicks;

    if (expiresAt && expiresAt < new Date()) {
      return 'expired';
    }

    if (maxClicks && link.clicks >= maxClicks) {
      return 'disabled';
    }

    return 'active';
  }

  async getById(id: string): Promise<ShortLink> {
    const link = await this.repo.findById(id);
    if (!link) {
      throw ShortLinkErrors.notFound(id);
    }

    return link;
  }

  async getByActiveSlug(slug: string): Promise<ShortLink> {
    const link = await this.repo.findByActiveSlug(slug);
    if (!link) {
      throw ShortLinkErrors.notFound(slug);
    }

    if (link.status !== 'active') {
      throw ShortLinkErrors.disabledShortLink(link.id);
    }

    if (isShortLinkExpired(link)) {
      throw ShortLinkErrors.expired(link.id);
    }

    return link;
  }

  async listByUser(params: LinkListParamsInput) {
    const { page = 1, limit = 10, userId, search, status } = params;

    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const dbStatus: DbShortLinkStatus | undefined =
      status === 'disabled' ? 'disabled' : undefined;

    const allItems = await this.repo.listByUser({
      userId,
      limit: 1000,
      offset: 0,
      search,
      status: dbStatus,
    });

    const withComputedStatus = allItems.map((link) => ({
      ...link,
      status: computeShortLinkStatus(link),
    }));

    const filteredItems = status
      ? withComputedStatus.filter((l) => l.status === status)
      : withComputedStatus;

    const paginatedItems = filteredItems.slice(offset, offset + safeLimit);
    const total = filteredItems.length;

    return {
      items: paginatedItems,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        hasNextPage: page * safeLimit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async create(
    userId: string,
    input: CreateShortLinkSchemaInput
  ): Promise<ShortLink> {
    const slug = input.slug ?? nanoid(7);

    const reservedSlugSet = new Set(
      RESERVED_ROUTES.map((s) => s.toLowerCase())
    );

    if (reservedSlugSet.has(slug.toLowerCase())) {
      throw ShortLinkErrors.reservedSlug(slug);
    }

    const exists = await this.repo.slugExists(slug);
    if (exists) {
      throw ShortLinkErrors.slugExists(slug);
    }

    return this.repo.create({
      ...input,
      slug,
      userId,
      expiresAt: input?.expiresAt ?? null,
      status: 'active',
    });
  }

  async update(
    userId: string,
    shortLinkId: string,
    input: UpdateShortLinkSchemaInput
  ): Promise<ShortLink> {
    const shortLink = await this.repo.findById(shortLinkId);
    if (!shortLink) {
      throw ShortLinkErrors.notFound(shortLinkId);
    }

    if (shortLink?.userId !== userId) {
      throw ShortLinkErrors.forbidden();
    }

    if (input.slug && input.slug !== shortLink.slug) {
      const exists = await this.repo.slugExists(input.slug);
      if (exists) {
        throw ShortLinkErrors.slugExists(input?.slug);
      }
    }

    if (
      input.maxClicks !== undefined &&
      input.maxClicks !== null &&
      input.maxClicks < shortLink.clicks
    ) {
      throw ShortLinkErrors.maxClicks(shortLinkId);
    }

    const updated = await this.repo.update(shortLinkId, {
      ...input,
      expiresAt: input.expiresAt === undefined ? undefined : input.expiresAt,
    });

    if (!updated) {
      throw ShortLinkErrors.invalidUrl(shortLinkId);
    }

    return updated;
  }

  async changeStatus(
    userId: string,
    shortLinkId: string,
    status: 'active' | 'disabled'
  ) {
    const shortLink = await this.repo.findById(shortLinkId);

    if (!shortLink) {
      throw ShortLinkErrors.notFound(shortLinkId);
    }

    if (shortLink.userId !== userId) {
      throw ShortLinkErrors.forbidden();
    }

    await this.repo.update(shortLinkId, { status });
  }

  async delete(userId: string, shortLinkId: string): Promise<void> {
    const shortLink = await this.repo.findById(shortLinkId);
    if (!shortLink || shortLink.deletedAt) {
      throw ShortLinkErrors.notFound(shortLink?.slug);
    }

    if (shortLink.userId !== userId) {
      throw ShortLinkErrors.forbidden();
    }

    await this.repo.softDelete(shortLinkId);
  }

  async recordClick(shortLinkId: string): Promise<void> {
    const success = await this.repo.incrementClicks(shortLinkId);

    if (!success) {
      throw ShortLinkErrors.maxClicks(shortLinkId);
    }
  }

  async sumClicks(userId: string) {
    return this.repo.sumClicks(userId);
  }
}
