import { logout, refresh } from '@/shared/api/generated';
import type { TokenResponse } from '@/shared/api/generated/types.gen';
import { extractTokenResponse, type AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { forbiddenMutationResponse, isTrustedMutation } from '@/app/api-routes/auth/route-utils';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;

type LogoutTokens = Pick<TokenResponse, 'accessToken' | 'refreshToken'>;

function reportLogoutFailure(
  phase: 'logout' | 'refresh',
  status: number | undefined,
  error: unknown,
): void {
  // 서버 관측용 로그이며 토큰 값은 포함하지 않는다.
  // eslint-disable-next-line no-console
  console.error('[auth] Failed to revoke the backend session during logout.', {
    phase,
    status,
    error,
  });
}

async function requestLogout(tokens: LogoutTokens) {
  return logout({
    auth: tokens.accessToken,
    body: { refreshToken: tokens.refreshToken },
  });
}

function isTransientFailure(status: number | undefined): boolean {
  return status === undefined || status >= 500;
}

async function revokeWithOneTransientRetry(
  tokens: LogoutTokens,
): Promise<'success' | 'unauthorized'> {
  const firstResult = await requestLogout(tokens);

  if (firstResult.error === undefined) {
    return 'success';
  }

  if (firstResult.response?.status === 401) {
    return 'unauthorized';
  }

  if (!isTransientFailure(firstResult.response?.status)) {
    reportLogoutFailure('logout', firstResult.response?.status, firstResult.error);
    return 'success';
  }

  const retryResult = await requestLogout(tokens);

  if (retryResult.error !== undefined) {
    reportLogoutFailure('logout', retryResult.response?.status, retryResult.error);
  }

  return retryResult.response?.status === 401 ? 'unauthorized' : 'success';
}

async function refreshOnce(session: AuthSession): Promise<TokenResponse | null> {
  const result = await refresh({
    body: { refreshToken: session.refreshToken },
  });

  if (result.error !== undefined) {
    if (result.response?.status !== 400 && result.response?.status !== 401) {
      reportLogoutFailure('refresh', result.response?.status, result.error);
    }

    return null;
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    reportLogoutFailure('refresh', result.response?.status, 'Invalid token response');
  }

  return tokens;
}

async function revokeBackendSession(session: AuthSession): Promise<void> {
  const accessTokenIsUsable =
    session.accessTokenExpiresAt > Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS;

  if (accessTokenIsUsable) {
    const result = await revokeWithOneTransientRetry(session);

    if (result === 'success') {
      return;
    }
  }

  // Refresh Token은 회전되므로 네트워크 오류가 발생해도 같은 토큰으로 재시도하지 않는다.
  const refreshedTokens = await refreshOnce(session);

  if (!refreshedTokens) {
    return;
  }

  await revokeWithOneTransientRetry(refreshedTokens);
}

export async function postLogout(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  try {
    if (session) {
      await revokeBackendSession(session);
    }
  } catch (error) {
    reportLogoutFailure('logout', undefined, error);
  } finally {
    await clearAuthSession();
  }

  return new Response(null, { status: 204 });
}
