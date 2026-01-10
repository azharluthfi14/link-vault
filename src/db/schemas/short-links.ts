import { index, pgTable } from 'drizzle-orm/pg-core';

import { user } from './auth';
import { linkStatusEnum } from './enums';

export const shortLinks = pgTable(
  'short_links',
  (table) => ({
    id: table.uuid('id').primaryKey().defaultRandom(),
    userId: table
      .text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    slug: table.varchar('slug', { length: 64 }).notNull().unique(),
    originalUrl: table.text('original_url').notNull(),
    status: linkStatusEnum('status').notNull().default('active'),
    clicks: table.integer('clicks').notNull().default(0),
    description: table.text('description'),
    expiresAt: table.timestamp('expires_at', { withTimezone: true }),
    maxClicks: table.integer('max_clicks'),
    deletedAt: table.timestamp('deleted_at', { withTimezone: true }),
    createdAt: table.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: table.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }),
  (table) => [
    index('short_links_slug_index').on(table.slug),
    index('short_links_user_id_index').on(table.userId),
    index('short_links_status_index').on(table.status),
  ]
);
