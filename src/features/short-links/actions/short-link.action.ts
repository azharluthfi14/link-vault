'use server';

import type {
  MutateShortLinkResponse,
  ShortLinkErrorCode,
} from '@/features/short-links';
import { updateShortLinkSchema } from '@/features/short-links';
import { createShortLinkSchema } from '@/features/short-links';
import { AuthError } from '@/libs/auth/auth-error';
import { getSession } from '@/libs/auth/get-session';

import { getShortLinkService } from '../services';
import { mapShortLinkError } from '../utils';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; code: ShortLinkErrorCode; message: string };

export async function createShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<MutateShortLinkResponse> {
  try {
    const session = await getSession();
    const raw = Object.fromEntries(formData.entries());
    const input = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== '')
    );
    const parsed = createShortLinkSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }
    const shortLinkService = getShortLinkService();
    const link = await shortLinkService.create(session.user.id, parsed.data);

    return {
      success: true,
      data: link,
      message: 'Success create short link',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }
    return mapShortLinkError(error);
  }
}

export async function updateShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<MutateShortLinkResponse> {
  try {
    const session = await getSession();

    const linkId = formData.get('id');
    if (typeof linkId !== 'string' || !linkId) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        fieldErrors: {
          id: ['Short link id is required'],
        },
      };
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

    const shortLinkService = getShortLinkService();

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
    if (error instanceof AuthError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }
    return mapShortLinkError(error);
  }
}

export async function deleteShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<MutateShortLinkResponse> {
  try {
    const session = await getSession();

    const linkId = formData.get('id');
    if (typeof linkId !== 'string' || !linkId) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        fieldErrors: {
          id: ['Short link id is required'],
        },
      };
    }

    const shortLinkService = getShortLinkService();

    await shortLinkService.delete(session.user.id, linkId);
    return { success: true, message: 'Success delete' };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }
    return mapShortLinkError(error);
  }
}
