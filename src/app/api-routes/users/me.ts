import { getMyProfile as getBackendMyProfile } from '@/shared/api/generated';
import { extractTokenResponse, type AuthSession } from '@/shared/lib/auth/session';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/app/api-routes/auth/session-cookie';
import { requestRefreshSingleFlight } from '@/app/api-routes/auth/refresh-single-flight';
import { upstreamErrorResponse } from '@/app/api-routes/auth/route-utils';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

type MyProfileResult = Awaited<ReturnType<typeof getBackendMyProfile>>;
type RefreshResult = Awaited<ReturnType<typeof requestRefreshSingleFlight>>;

function unauthorizedResponse(): Response {
  return new Response(null, { status: 401 });
}

async function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  let result: RefreshResult;

  try {
    result = await requestRefreshSingleFlight(session.refreshToken);
  } catch {
    return null;
  }

  if ('error' in result) {
    return null;
  }

  const tokens = extractTokenResponse(result.data.data);

  return tokens ? writeAuthSession(tokens) : null;
}

async function requestMyProfile(accessToken: string): Promise<MyProfileResult> {
  return getBackendMyProfile({ auth: accessToken });
}

function profileResponse(result: MyProfileResult): Response {
  if ('error' in result) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  return Response.json(result.data);
}

export async function getMyProfile(): Promise<Response> {
  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  let activeSession = session;
  let refreshed = false;

  if (session.accessTokenExpiresAt <= Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS) {
    const refreshedSession = await refreshSession(session);

    if (!refreshedSession) {
      await clearAuthSession();
      return unauthorizedResponse();
    }

    activeSession = refreshedSession;
    refreshed = true;
  }

  let result = await requestMyProfile(activeSession.accessToken);

  if (!('error' in result)) {
    return profileResponse(result);
  }

  if (result.response?.status !== 401) {
    return profileResponse(result);
  }

  if (refreshed) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  const refreshedSession = await refreshSession(activeSession);

  if (!refreshedSession) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  result = await requestMyProfile(refreshedSession.accessToken);

  if (result.response?.status === 401) {
    await clearAuthSession();
  }

  return profileResponse(result);
}
