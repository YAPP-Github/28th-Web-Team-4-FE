import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { refreshAuthSession } from '@/app/api-routes/auth/session-refresh';
import {
  forbiddenMutationResponse,
  isTrustedMutation,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';

export async function postRefresh(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return new Response(null, { status: 401 });
  }

  const result = await refreshAuthSession(session);

  if ('error' in result) {
    await clearAuthSession();
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  return new Response(null, { status: 204 });
}
