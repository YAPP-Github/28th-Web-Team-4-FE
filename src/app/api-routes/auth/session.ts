import { clearAuthSession } from '@/app/api-routes/auth/session-cookie';
import { readAuthSession } from '@/shared/lib/auth/session-cookie';

export async function getSession(): Promise<Response> {
  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return Response.json({ authenticated: false });
  }

  return Response.json({
    authenticated: true,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
  });
}
