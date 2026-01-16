/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ServiceErrorResponse,
  SuccessVoid,
  SuccessWithData,
  ValidationErrorResponse,
} from '../types/response.type';

export function successData<T>(data: T, message?: string): SuccessWithData<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

export function successVoid(message?: string): SuccessVoid {
  return {
    success: true,
    ...(message && { message }),
  };
}

export function serviceError(
  message: string,
  code: string,
  details?: any
): ServiceErrorResponse {
  return {
    success: false,
    error: message,
    code,
    showToast: true,
    ...(details && { details }),
  };
}

export function validationError(
  fieldErrors: Record<string, string[]>,
  message = 'Validation failed'
): ValidationErrorResponse {
  return {
    success: false,
    error: message,
    code: 'VALIDATION_ERROR',
    fieldErrors,
    showToast: false,
  };
}
