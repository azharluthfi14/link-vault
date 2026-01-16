import {
  and,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lt,
  or,
  sql,
} from 'drizzle-orm';

import { db } from '@/db';
import { shortLinks } from '@/db/schemas';
import type {
  DbShortLinkStatus,
  InsertShortLink,
  LinkListRepoParams,
  ShortLink,
  ShortLinkRepository,
} from '@/features/short-links';

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

  async listByUser(params: LinkListRepoParams): Promise<ShortLink[]> {
    const { userId, limit, offset, search, status } = params;

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
    status?: DbShortLinkStatus
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

  async sumClicks(userId: string): Promise<number> {
    const [result] = await db
      .select({ sum: sql<number>`sum(${shortLinks.clicks})` })
      .from(shortLinks)
      .where(and(eq(shortLinks.userId, userId), isNull(shortLinks.deletedAt)));

    return Number(result.sum ?? 0);
  }

  async getClicksGroupedByDay(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const results = await db
      .select({
        date: sql<string>`date(${shortLinks.createdAt})`,
        clicks: sql<number>`sum(${shortLinks.clicks})`,
      })
      .from(shortLinks)
      .where(
        and(
          eq(shortLinks.userId, userId),
          isNull(shortLinks.deletedAt),
          sql`${shortLinks.createdAt} >= ${startDate}`
        )
      )
      .groupBy(sql`date(${shortLinks.createdAt})`)
      .orderBy(sql`date(${shortLinks.createdAt})`);

    return results.map((r) => ({ date: r.date, clicks: Number(r.clicks) }));
  }

  async countInactiveLinkByUser(
    userId: string,
    now = new Date()
  ): Promise<number> {
    const [result] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(shortLinks)
      .where(
        and(
          eq(shortLinks.userId, userId),
          eq(shortLinks.status, 'disabled'),
          or(
            and(isNotNull(shortLinks.expiresAt), lt(shortLinks.expiresAt, now)),
            and(
              isNotNull(shortLinks.maxClicks),
              gte(shortLinks.clicks, shortLinks.maxClicks)
            )
          )
        )
      );

    return result.count;
  }
}
