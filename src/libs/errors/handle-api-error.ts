import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { ShortLinkError } from '@/features/short-links';
import { AuthError } from '@/libs/auth/auth-error';

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        type: 'AUTH_ERROR',
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ShortLinkError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        type: 'SHORT_LINK_ERROR',
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        type: 'VALIDATION_ERROR',
        details: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
        type: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      type: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}
