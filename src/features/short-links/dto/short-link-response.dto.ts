import { z } from 'zod';

export const shortLinkResponseSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  originalUrl: z.string(),
  description: z.string().nullable(),
  status: z.enum(['active', 'inactive', 'expired']),
  clicks: z.number(),
  expiresAt: z.date().nullable(),
  maxClicks: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShortLinkResponseDto = z.infer<typeof shortLinkResponseSchema>;
