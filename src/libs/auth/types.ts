import type { InferSelectModel } from 'drizzle-orm';

import type { user } from '@/db/schemas';

export type User = InferSelectModel<typeof user>;
