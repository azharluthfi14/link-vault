import z from 'zod';

export const createShortLinkSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters long')
    .max(64, 'Slug must be at most 64 characters long')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, _ and -'),
  originalUrl: z.url('Invalid URL format'),
  description: z.string().max(500, 'Description must be at most 500 characters long').optional(),
  expiresAt: z.iso.datetime().optional(),
  maxClicks: z.number().positive().optional(),
});

export type CreateLinkDto = z.infer<typeof createShortLinkSchema>;
