import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';

import { db } from '@/db';
import { shortLinks } from '@/db/schemas';

import type {
  InsertShortLink,
  LinkListParams,
  ShortLink,
  ShortLinkRepository,
  ShortLinkStatus,
} from './types';

export class DrizzleShortLinkRepository implements ShortLinkRepository {
  async findById(id: string): Promise<ShortLink | null> {
    const [link] = await db
      .select()
      .from(shortLinks)
      .where(and(eq(shortLinks.id, id), isNull(shortLinks.deletedAt)))
      .limit(1);

    return link ?? null;
  }

  async findByActiveSlug(slug: string): Promise<ShortLink | null> {
    const [link] = await db
      .select()
      .from(shortLinks)
      .where(
        and(
          eq(shortLinks.slug, slug),
          eq(shortLinks.status, 'active'),
          isNull(shortLinks.deletedAt)
        )
      )
      .limit(1);

    return link ?? null;
  }

  async listByUser(params: LinkListParams): Promise<ShortLink[]> {
    const { userId, limit, offset, search, status } = params;

    const conditions = [
      eq(shortLinks.userId, userId),
      isNull(shortLinks.deletedAt),
    ];

    if (status) {
      conditions.push(eq(shortLinks.status, status));
    }

    if (search) {
      conditions.push(ilike(shortLinks.slug, `%${search}%`));
    }

    return db
      .select()
      .from(shortLinks)
      .where(and(...conditions))
      .orderBy(desc(shortLinks.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async create(
    data: Omit<InsertShortLink, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShortLink> {
    const [link] = await db.insert(shortLinks).values(data).returning();

    return link;
  }

  async update(
    id: string,
    data: Partial<InsertShortLink>
  ): Promise<ShortLink | null> {
    const [link] = await db
      .update(shortLinks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(shortLinks.id, id))
      .returning();

    return link ?? null;
  }

  async slugExists(slug: string): Promise<boolean> {
    const [result] = await db
      .select({ id: shortLinks.id })
      .from(shortLinks)
      .where(and(eq(shortLinks.slug, slug), isNull(shortLinks.deletedAt)))
      .limit(1);

    return !!result;
  }

  async incrementClicks(id: string): Promise<boolean> {
    const result = await db
      .update(shortLinks)
      .set({
        clicks: sql`${shortLinks.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(shortLinks.id, id),
          eq(shortLinks.status, 'active'),
          or(
            isNull(shortLinks.maxClicks),
            sql`${shortLinks.clicks} < ${shortLinks.maxClicks}`
          )
        )
      )
      .returning({ id: shortLinks.id });

    return result.length > 0;
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(shortLinks)
      .set({
        deletedAt: new Date(),
        status: 'disabled',
        updatedAt: new Date(),
      })
      .where(eq(shortLinks.id, id));
  }

  async countByUser(
    userId: string,
    search?: string,
    status?: ShortLinkStatus
  ): Promise<number> {
    const conditions = [
      eq(shortLinks.userId, userId),
      isNull(shortLinks.deletedAt),
    ];

    if (status) {
      conditions.push(eq(shortLinks.status, status));
    }

    if (search) {
      conditions.push(ilike(shortLinks.slug, `%${search}`));
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(shortLinks)
      .where(and(...conditions));

    return Number(result.count);
  }
}
