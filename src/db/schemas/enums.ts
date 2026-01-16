import { pgEnum } from 'drizzle-orm/pg-core';

export const linkStatusEnum = pgEnum('link_status', ['active', 'disabled']);
