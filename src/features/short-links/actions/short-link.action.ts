'use server';

import type {
  DeleteShortLinkResult,
  MutateShortLinkResult,
} from '@/features/short-links';
import {
  ShortLinkErrorCode,
  updateShortLinkSchema,
} from '@/features/short-links';
import { createShortLinkSchema, ShortLinkError } from '@/features/short-links';
import { getSession } from '@/libs/auth/get-session';

import { getShortLinkService } from '../services';
import { mapShortLinkError } from '../utils';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; code: ShortLinkErrorCode; message: string };

const shortLinkService = getShortLinkService();

export async function createShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<MutateShortLinkResult> {
  try {
    const session = await getSession();

    const raw = Object.fromEntries(formData.entries());

    if (raw.expiresAt === '') delete raw.expiresAt;
    if (raw.maxClicks === '') delete raw.maxClicks;

    const parsed = createShortLinkSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const link = await shortLinkService.create(session.user.id, parsed.data);

    return {
      success: true,
      data: link,
      message: 'Success create short link',
    };
  } catch (error) {
    return mapShortLinkError(error);
  }
}

export async function updateShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<MutateShortLinkResult> {
  try {
    const session = await getSession();

    const linkId = formData.get('id');
    if (!linkId || typeof linkId !== 'string') {
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    const raw = Object.fromEntries(formData.entries());
    const { id: _id, ...payload } = raw;

    Object.entries(payload).forEach(([k, v]) => {
      if (v === '') delete payload[k];
    });

    const parsed = updateShortLinkSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await shortLinkService.update(
      session.user.id,
      linkId,
      parsed.data
    );

    return {
      success: true,
      data: updated,
      message: 'Success update short link',
    };
  } catch (error) {
    return mapShortLinkError(error);
  }
}

export async function deleteShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<DeleteShortLinkResult> {
  try {
    const session = await getSession();

    const linkId = formData.get('id');

    if (!linkId || typeof linkId !== 'string') {
      throw new ShortLinkError(ShortLinkErrorCode.NOT_FOUND);
    }

    await shortLinkService.delete(session.user.id, linkId);
    return { success: true, message: 'Success delete' };
  } catch (error) {
    return mapShortLinkError(error);
  }
}
