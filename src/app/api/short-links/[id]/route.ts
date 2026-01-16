import { NextResponse } from 'next/server';

import { ShortLinkErrors } from '@/features/short-links';
import { getShortLinkService } from '@/features/short-links/services';
import { getSession } from '@/libs/auth/get-session';
import { handleApiError } from '@/libs/handlers/api-error.handler';

const shortLinkService = getShortLinkService();

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    const { id } = await ctx.params;

    const link = await shortLinkService.getById(id);

    if (link.userId !== session.user.id) {
      throw ShortLinkErrors.forbidden();
    }

    return NextResponse.json(link);
  } catch (error) {
    return handleApiError(error);
  }
}
