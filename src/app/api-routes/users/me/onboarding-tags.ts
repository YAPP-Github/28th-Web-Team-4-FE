import { getMyOnboardingTag as getBackendMyOnboardingTag } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { refreshAuthSession } from '@/app/api-routes/auth/session-refresh';
import { upstreamErrorResponse } from '@/app/api-routes/auth/route-utils';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

type OnboardingTagResult = Awaited<ReturnType<typeof getBackendMyOnboardingTag>>;
type OnboardingTagRequest = (accessToken: string) => Promise<OnboardingTagResult>;

function unauthorizedResponse(): Response {
  return new Response(null, { status: 401 });
}

async function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  const result = await refreshAuthSession(session);

  return 'error' in result ? null : result.session;
}

function onboardingTagResponse(result: OnboardingTagResult): Response {
  if ('error' in result) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  return Response.json(result.data);
}

async function executeWithSession(requestOnboardingTag: OnboardingTagRequest): Promise<Response> {
  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  let activeSession = session;
  let didRefresh = false;

  if (session.accessTokenExpiresAt <= Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS) {
    const refreshedSession = await refreshSession(session);

    if (!refreshedSession) {
      await clearAuthSession();
      return unauthorizedResponse();
    }

    activeSession = refreshedSession;
    didRefresh = true;
  }

  let result = await requestOnboardingTag(activeSession.accessToken);

  if (!('error' in result)) {
    return onboardingTagResponse(result);
  }

  if (result.response?.status !== 401) {
    return onboardingTagResponse(result);
  }

  if (didRefresh) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  const refreshedSession = await refreshSession(activeSession);

  if (!refreshedSession) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  result = await requestOnboardingTag(refreshedSession.accessToken);

  if ('error' in result && result.response?.status === 401) {
    await clearAuthSession();
    return unauthorizedResponse();
  }

  return onboardingTagResponse(result);
}

export function getMyOnboardingTag(): Promise<Response> {
  return executeWithSession((accessToken) => getBackendMyOnboardingTag({ auth: accessToken }));
}
