import { pgTable } from 'drizzle-orm/pg-core';

export const user = pgTable('user', (table) => ({
  id: table.text('id').primaryKey(),
  name: table.text('name').notNull(),
  email: table.text('email').notNull().unique(),
  emailVerified: table.boolean('email_verified').notNull().default(false),
  image: table.text('image'),
  createdAt: table.timestamp('created_at').notNull().defaultNow(),
  updatedAt: table.timestamp('updated_at').notNull().defaultNow(),
}));

export const session = pgTable('session', (table) => ({
  id: table.text('id').primaryKey(),
  expiresAt: table.timestamp('expires_at').notNull(),
  token: table.text('token').notNull().unique(),
  createdAt: table.timestamp('created_at').notNull().defaultNow(),
  updatedAt: table.timestamp('updated_at').notNull().defaultNow(),
  ipAddress: table.text('ip_address'),
  userAgent: table.text('user_agent'),
  userId: table
    .text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
}));

export const account = pgTable('account', (table) => ({
  id: table.text('id').primaryKey(),
  accountId: table.text('account_id').notNull(),
  providerId: table.text('provider_id').notNull(),
  userId: table
    .text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: table.text('access_token'),
  refreshToken: table.text('refresh_token'),
  idToken: table.text('id_token'),
  accessTokenExpiresAt: table.timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: table.timestamp('refresh_token_expires_at'),
  scope: table.text('scope'),
  password: table.text('password'),
  createdAt: table.timestamp('created_at').notNull().defaultNow(),
  updatedAt: table.timestamp('updated_at').notNull().defaultNow(),
}));

export const verification = pgTable('verification', (table) => ({
  id: table.text('id').primaryKey(),
  identifier: table.text('identifier').notNull(),
  value: table.text('value').notNull(),
  expiresAt: table.timestamp('expires_at').notNull(),
  createdAt: table.timestamp('created_at').notNull().defaultNow(),
  updatedAt: table.timestamp('updated_at').notNull().defaultNow(),
}));
