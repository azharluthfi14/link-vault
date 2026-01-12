import z from 'zod';

export const listQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  status: z.enum(['active', 'disabled', 'expired']).optional(),
});

export type LinkListQueryParams = z.infer<typeof listQueryParamsSchema>;
