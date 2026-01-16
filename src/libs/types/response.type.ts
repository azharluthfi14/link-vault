/* eslint-disable @typescript-eslint/no-explicit-any */

export type SuccessWithData<T> = {
  success: true;
  data: T;
  message?: string;
};

export type SuccessVoid = {
  success: true;
  message?: string;
};

export type ValidationErrorResponse = {
  success: false;
  error: string;
  code: 'VALIDATION_ERROR';
  fieldErrors: Record<string, string[]>;
  showToast?: false;
};

export type ServiceErrorResponse = {
  success: false;
  error: string;
  code: string;
  details?: any;
  showToast: true;
};

export type ErrorResult = ServiceErrorResponse | ValidationErrorResponse;

export type DataResult<T> =
  | SuccessWithData<T>
  | ServiceErrorResponse
  | ValidationErrorResponse;

export type VoidResult =
  | SuccessVoid
  | ServiceErrorResponse
  | ValidationErrorResponse;

export function isSuccessWithData<T>(
  result: DataResult<T>
): result is SuccessWithData<T> {
  return result.success === true;
}

export function isSuccess(result: VoidResult): result is SuccessVoid {
  return result.success === true;
}

export function isServiceError(
  result: DataResult<any> | VoidResult
): result is ServiceErrorResponse {
  return result.success === false && result.code !== 'VALIDATION_ERROR';
}

export function isValidationError(
  result: DataResult<any> | VoidResult
): result is ValidationErrorResponse {
  return result.success === false && result.code === 'VALIDATION_ERROR';
}

export function unwrapData<T>(result: DataResult<T>): T {
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

export function assertSuccess(result: VoidResult): void {
  if (!result.success) {
    throw new Error(result.error);
  }
}

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
