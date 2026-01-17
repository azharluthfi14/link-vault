'use server';

import type { ShortLink } from '@/features/short-links';
import { updateShortLinkSchema } from '@/features/short-links';
import { createShortLinkSchema } from '@/features/short-links';
import { getSession } from '@/libs/auth/get-session';
import { BadRequestError } from '@/libs/errors/base.error';
import { handleAction, handleVoidAction } from '@/libs/handlers/action.handler';
import type { DataResult, VoidResult } from '@/libs/types/response.type';
import { validateSchema } from '@/libs/validation/validation';

import { getShortLinkService } from '../services';

export async function createShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<DataResult<ShortLink>> {
  return handleAction(async () => {
    const session = await getSession();
    const raw = Object.fromEntries(formData.entries());
    const input = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== '')
    );
    const validated = validateSchema(createShortLinkSchema, input);

    const shortLinkService = getShortLinkService();
    const link = await shortLinkService.create(session.user.id, validated);

    return link;
  });
}

export async function updateShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<DataResult<ShortLink>> {
  return handleAction(async () => {
    const session = await getSession();

    const linkId = formData.get('id');

    if (typeof linkId !== 'string' || !linkId) {
      throw new BadRequestError('Short link id is required');
    }
    const raw = Object.fromEntries(formData.entries());
    const { id: _id, ...payload } = raw;
    Object.entries(payload).forEach(([k, v]) => {
      if (v === '') delete payload[k];
    });

    const validated = validateSchema(updateShortLinkSchema, payload);
    const shortLinkService = getShortLinkService();
    const updated = await shortLinkService.update(
      session.user.id,
      linkId,
      validated
    );

    return updated;
  });
}

export async function deleteShortLinkAction(
  _prevState: unknown,
  formData: FormData
): Promise<VoidResult> {
  return handleAction(async () => {
    const session = await getSession();
    const linkId = formData.get('id');

    if (typeof linkId !== 'string' || !linkId) {
      throw new BadRequestError('Short link id is required');
    }
    const shortLinkService = getShortLinkService();
    await shortLinkService.delete(session.user.id, linkId);

    return undefined as void;
  });
}

export async function enabledShortLink(
  _prevState: unknown,
  formData: FormData
): Promise<VoidResult> {
  return handleVoidAction(async () => {
    const session = await getSession();
    const linkId = formData.get('id');

    if (typeof linkId !== 'string' || !linkId) {
      throw new BadRequestError('Short link id is required');
    }

    const shortLinkService = getShortLinkService();
    await shortLinkService.enable(session.user.id, linkId);
  });
}

export async function disabledShortLink(
  _prevState: unknown,
  formData: FormData
): Promise<VoidResult> {
  return handleVoidAction(async () => {
    const session = await getSession();
    const linkId = formData.get('id');

    if (typeof linkId !== 'string' || !linkId) {
      throw new BadRequestError('Short link id is required');
    }

    const shortLinkService = getShortLinkService();
    await shortLinkService.disable(session.user.id, linkId);
  });
}
