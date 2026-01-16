import { ZodError } from 'zod';

import { AppError, ValidationError } from '../errors/base.error';
import type { ErrorResult } from '../types/response.type';
import { serviceError, validationError } from './builders';

export function mapErrorResult(err: unknown): ErrorResult {
  if (err instanceof ValidationError) {
    return validationError(err.fieldErrors || {}, err.message);
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors as Record<string, string[]>;
    return validationError(fieldErrors);
  }

  if (err instanceof AppError) {
    return serviceError(err.message, err.code, err.details);
  }

  if (err instanceof Error) {
    return serviceError(err.message, 'INTERNAL_ERROR');
  }

  return serviceError('An unexpected error occurred', 'UNKNOWN_ERROR');
}

export function mapResultToStatus(result: ErrorResult): number {
  switch (result.code) {
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'VALIDATION_ERROR':
      return 400;
    case 'NOT_FOUND':
      return 404;
    default:
      return 500;
  }
}
