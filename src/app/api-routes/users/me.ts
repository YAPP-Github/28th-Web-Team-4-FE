import {
  getMyProfile as getBackendMyProfile,
  updateMyProfile as updateBackendMyProfile,
} from '@/shared/api/generated';
import type { UpdateProfileRequest } from '@/shared/api/generated/types.gen';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { refreshAuthSession } from '@/app/api-routes/auth/session-refresh';
import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';
import { z } from 'zod';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

const updateProfileRequestSchema = z.object({
  companyName: z.string().trim().min(1).max(50),
  occupation: z.enum([
    'DEVELOPMENT',
    'DESIGN',
    'MARKETING',
    'PLANNING',
    'SALES',
    'DATA',
    'MANAGEMENT',
    'ETC',
  ]),
});

type ProfileResult = Awaited<ReturnType<typeof getBackendMyProfile>>;
type ProfileRequest = (accessToken: string) => Promise<ProfileResult>;

function unauthorizedResponse(): Response {
  return new Response(null, { status: 401 });
}

async function refreshSession(session: AuthSession): Promise<AuthSession | null> {
  const result = await refreshAuthSession(session);

  return 'error' in result ? null : result.session;
}

function profileResponse(result: ProfileResult): Response {
  if ('error' in result) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  return Response.json(result.data);
}

async function executeWithSession(requestProfile: ProfileRequest): Promise<Response> {
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

  let result = await requestProfile(activeSession.accessToken);

  if (!('error' in result)) {
    return profileResponse(result);
  }

  if (result.response?.status !== 401) {
    return profileResponse(result);
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

  result = await requestProfile(refreshedSession.accessToken);

  if (result.response?.status === 401) {
    await clearAuthSession();
  }

  return profileResponse(result);
}

export async function getMyProfile(): Promise<Response> {
  return executeWithSession((accessToken) => getBackendMyProfile({ auth: accessToken }));
}

export async function patchMyProfile(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const parsedBody = updateProfileRequestSchema.safeParse(await readJson(request));

  if (!parsedBody.success) {
    return invalidRequestResponse();
  }

  const body: UpdateProfileRequest = parsedBody.data;

  return executeWithSession((accessToken) => updateBackendMyProfile({ auth: accessToken, body }));
}
