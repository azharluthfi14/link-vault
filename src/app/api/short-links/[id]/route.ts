import { NextResponse } from 'next/server';

import {
  DrizzleShortLinkRepository,
  ShortLinkError,
  ShortLinkErrorCode,
  ShortLinkServices,
} from '@/features/short-links';
import { getSession } from '@/libs/auth/get-session';
import { handleApiError } from '@/libs/errors/handle-api-error';

const shortLinkService = new ShortLinkServices({
  repo: new DrizzleShortLinkRepository(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    const { id } = await ctx.params; // 🔥 WAJIB await

    const link = await shortLinkService.getById(id);

    if (link.userId !== session.user.id) {
      throw new ShortLinkError(ShortLinkErrorCode.FORBIDDEN);
    }

    return NextResponse.json(link);
  } catch (error) {
    return handleApiError(error);
  }
}
