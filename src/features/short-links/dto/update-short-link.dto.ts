import type { z } from 'zod';

import { createShortLinkSchema } from './create-short-link.dto';

export const updateShortLinkSchema = createShortLinkSchema.partial();

export type UpdateShortLinkDto = z.infer<typeof updateShortLinkSchema>;
