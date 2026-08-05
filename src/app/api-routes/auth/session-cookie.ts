import { cookies } from 'next/headers';

import type { TokenResponse } from '@/shared/api/generated/types.gen';
import {
  createAuthSession,
  encryptAuthSession,
  getSessionCookieOptions,
  type AuthSession,
} from '@/shared/lib/auth/session';

export { hasActiveAuthSession, readAuthSession } from '@/shared/lib/auth/session-cookie';

export async function writeAuthSession(tokens: TokenResponse): Promise<AuthSession> {
  const session = createAuthSession(tokens);
  const cookie = getSessionCookieOptions(session.refreshTokenExpiresAt);

  (await cookies()).set({
    ...cookie,
    value: encryptAuthSession(session),
  });

  return session;
}

export async function clearAuthSession(): Promise<void> {
  const cookie = getSessionCookieOptions(Date.now());

  (await cookies()).set({
    ...cookie,
    value: '',
    maxAge: 0,
  });
}
