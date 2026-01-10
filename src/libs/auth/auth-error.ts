export enum AuthErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_SESSION = 'INVALID_SESSION',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export const AuthErrorMessage: Record<AuthErrorCode, string> = {
  UNAUTHENTICATED: 'Authentication required',
  INVALID_SESSION: 'Your session is invalid',
  SESSION_EXPIRED: 'Your session has expired',
};

export const AuthErrorStatus: Record<AuthErrorCode, number> = {
  UNAUTHENTICATED: 401,
  INVALID_SESSION: 401,
  SESSION_EXPIRED: 401,
};

export class AuthError extends Error {
  public readonly statusCode: number;
  constructor(public readonly code: AuthErrorCode) {
    super(AuthErrorMessage[code]);
    this.name = 'AuthError';
    this.statusCode = AuthErrorStatus[code];
  }
}
