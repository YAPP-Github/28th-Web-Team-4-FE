import { withdraw } from '@/shared/api/generated';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { refreshAuthSession } from './session-refresh';
import { forbiddenMutationResponse, isTrustedMutation, upstreamErrorResponse } from './route-utils';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

export async function postWithdraw(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return new Response(null, { status: 401 });
  }

  let activeSession = session;
  let didRefresh = false;

  if (session.accessTokenExpiresAt <= Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS) {
    const refreshed = await refreshAuthSession(session);

    if ('error' in refreshed) {
      await clearAuthSession();
      return upstreamErrorResponse(refreshed.error, refreshed.response?.status);
    }

    activeSession = refreshed.session;
    didRefresh = true;
  }

  let result: Awaited<ReturnType<typeof withdraw>>;

  try {
    result = await withdraw({ auth: activeSession.accessToken });
  } catch (error) {
    return upstreamErrorResponse(error);
  }

  if (result.error !== undefined && result.response?.status === 401 && !didRefresh) {
    const refreshed = await refreshAuthSession(session);

    if ('error' in refreshed) {
      await clearAuthSession();
      return upstreamErrorResponse(refreshed.error, refreshed.response?.status);
    }

    try {
      result = await withdraw({ auth: refreshed.session.accessToken });
    } catch (error) {
      return upstreamErrorResponse(error);
    }
  }

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  if (!result.data) {
    return upstreamErrorResponse(null);
  }

  await clearAuthSession();

  return new Response(null, { status: 204 });
}
