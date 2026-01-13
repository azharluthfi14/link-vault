import { NextResponse } from 'next/server';

import { listShortLinkQueryParamsSchema } from '@/features/short-links';
import { getShortLinkService } from '@/features/short-links/services';
import { getSession } from '@/libs/auth/get-session';
import { handleApiError } from '@/libs/errors/handle-api-error';

const shortLinkService = getShortLinkService();

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    const parsed = listShortLinkQueryParamsSchema.safeParse(
      Object.fromEntries(
        [...searchParams.entries()].filter(([, v]) => v !== '')
      )
    );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          code: 'VALIDATION_ERROR',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await shortLinkService.listByUser({
      userId: session.user.id,
      ...parsed.data,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log('error', error);
    return handleApiError(error);
  }
}
