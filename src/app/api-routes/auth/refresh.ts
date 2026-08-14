import type { refresh } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  isTrustedMutation,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';
import { requestRefreshSingleFlight } from '@/app/api-routes/auth/refresh-single-flight';

type RefreshResult = Awaited<ReturnType<typeof refresh>>;

export async function postRefresh(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return new Response(null, { status: 401 });
  }

  let result: RefreshResult;

  try {
    result = await requestRefreshSingleFlight(session.refreshToken);
  } catch (error) {
    await clearAuthSession();
    return upstreamErrorResponse(error);
  }

  if ('error' in result) {
    await clearAuthSession();
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    await clearAuthSession();
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(tokens);

  return new Response(null, { status: 204 });
}
