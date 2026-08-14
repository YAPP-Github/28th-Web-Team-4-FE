import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  isTrustedMutation,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';
import { refreshAuthSession } from './session-refresh';

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
