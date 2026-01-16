import { UnauthorizedError } from '../errors/base.error';

export class InvalidSessionError extends UnauthorizedError {
  readonly code = 'INVALID_SESSION';

  constructor() {
    super('Your session is invalid');
  }
}

export class SessionExpiredError extends UnauthorizedError {
  readonly code = 'SESSION_EXPIRED';

  constructor() {
    super('Your session has expired');
  }
}

export const AuthErrors = {
  unauthenticated: () => new UnauthorizedError('Authentication required'),
  invalidSession: () => new InvalidSessionError(),
  sessionExpired: () => new SessionExpiredError(),
};
