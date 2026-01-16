/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import {
  AppError,
  UnauthorizedError,
  ValidationError,
} from '../errors/base.error';
import { serviceError, validationError } from '../response/builders';

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        success: false,
        code: err.code,
        message: err.message,
      },
      { status: err.statusCode }
    );
  }

  if (err instanceof ValidationError) {
    return NextResponse.json(
      validationError(err.fieldErrors || {}, err.message),
      { status: err.statusCode }
    );
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors as Record<string, string[]>;
    return NextResponse.json(validationError(fieldErrors), { status: 400 });
  }

  if (err instanceof AppError) {
    return NextResponse.json(serviceError(err.message, err.code, err.details), {
      status: err.statusCode,
    });
  }

  if (err instanceof Error) {
    return NextResponse.json(serviceError(err.message, 'INTERNAL_ERROR'), {
      status: 500,
    });
  }

  return NextResponse.json(
    serviceError('An unexpected error occurred', 'UNKNOWN_ERROR'),
    { status: 500 }
  );
}

export function withApiErrorHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (err) {
      return handleApiError(err);
    }
  };
}
