import { headers } from 'next/headers';

import { auth } from './auth';
import { AuthErrors } from './auth-error';

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw AuthErrors.unauthenticated();
  }

  return session;
}

// export async function withAuthAction<T>(
//   fn: (session: Session) => Promise<T>
// ) {
//   try {
//     const session = await getSession();
//     return await fn(session);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return {
//         success: false,
//         code: error.code,
//         message: error.message,
//       };
//     }
//     throw error;
//   }
// }
