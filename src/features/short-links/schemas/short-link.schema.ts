import z from 'zod';

import { RESERVED_ROUTES } from '@/constants';

const reservedSlugSet = new Set(RESERVED_ROUTES.map((s) => s.toLowerCase()));

export const createShortLinkSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters long')
    .max(64, 'Slug must be at most 64 characters long')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'Slug can only contain letters, numbers, _ and -'
    )
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v))
    .refine((slug) => !slug || !reservedSlugSet.has(slug.toLowerCase()), {
      message: 'This slug is reserved and cannot be used',
    }),

  originalUrl: z.url('Invalid URL format'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters long')
    .optional(),
  expiresAt: z
    .preprocess((value) => {
      if (!value || typeof value !== 'string') return undefined;
      const cleaned = value.replace(/\[.*\]$/, '');
      const date = new Date(cleaned);
      if (isNaN(date.getTime())) return undefined;
      return date;
    }, z.date())
    .optional()
    .refine((value) => !value || value.getTime() > Date.now(), {
      message: 'Expiration date must be in the future',
    }),
  maxClicks: z.coerce.number().int().positive().optional(),
});

export const updateShortLinkSchema = createShortLinkSchema.partial();

export const listShortLinkQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  status: z.enum(['active', 'disabled', 'expired']).optional(),
});

export type CreateShortLinkSchemaInput = z.infer<typeof createShortLinkSchema>;
export type UpdateShortLinkSchemaInput = z.infer<typeof updateShortLinkSchema>;
export type ListShortLinkQueryParamsInput = z.infer<
  typeof listShortLinkQueryParamsSchema
>;
