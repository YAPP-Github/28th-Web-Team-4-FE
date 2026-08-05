import { cookies } from 'next/headers';

import {
  decryptAuthSession,
  getSessionCookieName,
  type AuthSession,
} from '@/shared/lib/auth/session';

export async function readAuthSession(): Promise<AuthSession | null> {
  const encryptedSession = (await cookies()).get(getSessionCookieName())?.value;

  return encryptedSession ? decryptAuthSession(encryptedSession) : null;
}

export async function hasActiveAuthSession(now = Date.now()): Promise<boolean> {
  const session = await readAuthSession();

  return session !== null && session.refreshTokenExpiresAt > now;
}
