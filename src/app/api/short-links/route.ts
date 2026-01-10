import { NextResponse } from 'next/server';

import {
  DrizzleShortLinkRepository,
  listQueryParamsSchema,
  ShortLinkServices,
} from '@/features/short-links';
import { getSession } from '@/libs/auth/get-session';
import { handleApiError } from '@/libs/errors/handle-api-error';

const shortLinkService = new ShortLinkServices({
  repo: new DrizzleShortLinkRepository(),
});

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    const parsed = listQueryParamsSchema.safeParse(
      Object.fromEntries(searchParams)
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
