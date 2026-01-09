import { defineConfig } from 'drizzle-kit';

import { env } from '@/config/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
