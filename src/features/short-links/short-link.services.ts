import { nanoid } from 'nanoid';

import type { CreateLinkDto, UpdateShortLinkDto } from './dto';
import { ShortLinkError, ShortLinkErrorCode } from './errors';
import type {
  LinkListParamsInput,
  ShortLink,
  ShortLinkRepository,
  ShortLinkServiceDeps,
} from './types';

export class ShortLinkServices {
  private readonly repo: ShortLinkRepository;

  constructor(deps: ShortLinkServiceDeps) {
    this.repo = deps.repo;
  }

  private computeStatus(link: ShortLink, input: UpdateShortLinkDto) {
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
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    return link;
  }

  async getByActiveSlug(slug: string): Promise<ShortLink> {
    const link = await this.repo.findByActiveSlug(slug);
    if (!link) {
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      await this.repo.update(link.id, { status: 'expired' });
      throw new ShortLinkError(ShortLinkErrorCode.EXPIRED);
    }

    if (link.maxClicks !== null && link.clicks >= link.maxClicks) {
      await this.repo.update(link.id, { status: 'expired' });
      throw new ShortLinkError(ShortLinkErrorCode.MAX_CLICKS_REACHED);
    }

    return link;
  }

  async listByUser(params: LinkListParamsInput) {
    const { page = 1, limit = 10, userId, search, status } = params;

    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [items, total] = await Promise.all([
      this.repo.listByUser({
        userId,
        limit: safeLimit,
        offset,
        search,
        status,
      }),
      this.repo.countByUser(userId, search, status),
    ]);

    return {
      items,
      meta: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async create(userId: string, input: CreateLinkDto): Promise<ShortLink> {
    const slug = input.slug ?? nanoid(7);

    const exists = await this.repo.slugExists(slug);
    if (exists) {
      throw new ShortLinkError(ShortLinkErrorCode.SLUG_ALREADY_EXISTS);
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
    input: UpdateShortLinkDto
  ): Promise<ShortLink> {
    const shortLink = await this.repo.findById(shortLinkId);
    if (!shortLink) {
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    if (shortLink?.userId !== userId) {
      throw new ShortLinkError(ShortLinkErrorCode.FORBIDDEN);
    }

    if (input.slug && input.slug !== shortLink.slug) {
      const exists = await this.repo.slugExists(input.slug);
      if (exists) {
        throw new ShortLinkError(ShortLinkErrorCode.SLUG_ALREADY_EXISTS);
      }
    }

    if (shortLink.status === 'expired' && !input.expiresAt) {
      throw new ShortLinkError(ShortLinkErrorCode.EXPIRED);
    }

    if (
      input.maxClicks !== undefined &&
      input.maxClicks !== null &&
      input.maxClicks < shortLink.clicks
    ) {
      throw new ShortLinkError(ShortLinkErrorCode.MAX_CLICKS_REACHED);
    }

    const status = this.computeStatus(shortLink, input);

    const updated = await this.repo.update(shortLinkId, {
      ...input,
      expiresAt: input.expiresAt === undefined ? undefined : input.expiresAt,
      status,
    });

    if (!updated) {
      throw new ShortLinkError(ShortLinkErrorCode.INVALID_URL);
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
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    if (shortLink.userId !== userId) {
      throw new ShortLinkError(ShortLinkErrorCode.FORBIDDEN);
    }

    if (shortLink.status === 'expired') {
      throw new ShortLinkError(ShortLinkErrorCode.INVALID_STATUS);
    }

    await this.repo.update(shortLinkId, { status });
  }

  async delete(userId: string, shortLinkId: string): Promise<void> {
    const shortLink = await this.repo.findById(shortLinkId);
    if (!shortLink) {
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    if (shortLink.userId !== userId) {
      throw new ShortLinkError(ShortLinkErrorCode.FORBIDDEN);
    }

    await this.repo.softDelete(shortLinkId);
  }

  async recordClick(shortLinkId: string): Promise<void> {
    const success = await this.repo.incrementClicks(shortLinkId);

    if (!success) {
      throw new ShortLinkError(ShortLinkErrorCode.MAX_CLICKS_REACHED);
    }
  }
}
