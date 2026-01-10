import { z } from 'zod';

import { createShortLinkSchema } from './create-short-link.dto';

export const updateShortLinkSchema = createShortLinkSchema.partial().extend({
  status: z.enum(['active', 'disabled', 'expired']).optional(),
});

export type UpdateShortLinkDto = z.infer<typeof updateShortLinkSchema>;
