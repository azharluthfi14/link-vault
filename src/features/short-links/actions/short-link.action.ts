'use server';

import { revalidatePath } from 'next/cache';

import type { ShortLinkErrorCode } from '@/features/short-links';
import {
  createShortLinkSchema,
  DrizzleShortLinkRepository,
  ShortLinkServices,
} from '@/features/short-links';
import { getSession } from '@/libs/auth/get-session';

import { mapShortLinkError } from '../utils';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; code: ShortLinkErrorCode; message: string };

const shortLinkService = new ShortLinkServices({
  repo: new DrizzleShortLinkRepository(),
});

export async function createShortLinkAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await getSession();

  const raw = Object.entries(formData.entries());
  const parsed = createShortLinkSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const link = await shortLinkService.create(session.user.id, parsed.data);
    revalidatePath('/links');
    return { success: true, data: link };
  } catch (error) {
    return mapShortLinkError(error);
  }
}
