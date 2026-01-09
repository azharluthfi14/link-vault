import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
