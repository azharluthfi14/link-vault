import { headers } from 'next/headers';

import { auth } from './auth';
import { AuthError, AuthErrorCode } from './auth-error';

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
  }

  return session;
}
