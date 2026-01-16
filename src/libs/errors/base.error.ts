/* eslint-disable @typescript-eslint/no-explicit-any */

export type UnauthorizedErrorCode =
  | 'UNAUTHORIZED'
  | 'SESSION_EXPIRED'
  | 'INVALID_SESSION';

export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string = 'Validation failed',
    public readonly fieldErrors?: Record<string, string[]>
  ) {
    super(message, fieldErrors);
  }
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(message: string = 'Resources not found') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;

  constructor(message = 'Access forbidden') {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  readonly code: UnauthorizedErrorCode = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;

  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, { field });
  }
}

export class BadRequestError extends AppError {
  readonly code = 'BAD_REQUEST';
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class InternalError extends AppError {
  readonly code = 'INTERNAL_ERROR';
  readonly statusCode = 500;

  constructor(message: string = 'Internal server error') {
    super(message);
  }
}
