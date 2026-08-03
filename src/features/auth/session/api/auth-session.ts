import { z } from 'zod';

import { ensureResponseOk, parseJsonResponse } from '@/shared/api/response';

const authSessionStateSchema = z.discriminatedUnion('authenticated', [
  z.object({ authenticated: z.literal(false) }),
  z.object({
    authenticated: z.literal(true),
    accessTokenExpiresAt: z.number().int().positive(),
  }),
]);

export type AuthSessionState = z.infer<typeof authSessionStateSchema>;

export async function getAuthSession(): Promise<AuthSessionState> {
  const response = await fetch('/api/auth/session', {
    cache: 'no-store',
    credentials: 'same-origin',
  });

  return authSessionStateSchema.parse(await parseJsonResponse<unknown>(response));
}

export async function refreshAuthSession(): Promise<void> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'same-origin',
  });

  await ensureResponseOk(response);
}

export async function logoutAuthSession(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });

  await ensureResponseOk(response);
}
