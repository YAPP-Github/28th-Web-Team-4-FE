import * as Sentry from '@sentry/nextjs';

import { logout, refresh } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { postLogout } from './logout';

vi.mock('@/shared/api/generated', () => ({
  logout: vi.fn<typeof logout>(),
  refresh: vi.fn<typeof refresh>(),
}));
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn<typeof Sentry.captureException>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
}));

const captureExceptionMock = vi.mocked(Sentry.captureException);
const logoutMock = vi.mocked(logout);
const refreshMock = vi.mocked(refresh);
const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const now = 1_000_000;
const session: AuthSession = {
  accessToken: 'access-token',
  accessTokenExpiresAt: now + 60_000,
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: now + 3_600_000,
};
const refreshedTokens = {
  accessToken: 'new-access-token',
  accessTokenExpiresIn: 1_800,
  refreshToken: 'new-refresh-token',
  refreshTokenExpiresIn: 7_200,
};

function logoutRequest(): Request {
  return new Request('https://chaeso-zip.com/api/auth/logout', {
    method: 'POST',
    headers: {
      origin: 'https://chaeso-zip.com',
      'sec-fetch-site': 'same-origin',
    },
  });
}

function logoutSuccessResponse(): Awaited<ReturnType<typeof logout>> {
  return {
    data: { success: true, data: null, error: null, code: null },
    response: new Response(null, { status: 200 }),
  };
}

function refreshSuccessResponse(): Awaited<ReturnType<typeof refresh>> {
  return {
    data: { success: true, data: refreshedTokens, error: null, code: null },
    response: new Response(null, { status: 200 }),
  };
}

function errorResponse(
  status: number,
): Awaited<ReturnType<typeof logout>> & Awaited<ReturnType<typeof refresh>> {
  return {
    data: undefined,
    error: {
      success: false,
      data: null,
      error: { code: 'AUTH-004', message: '인증 실패', fieldErrors: [] },
      code: null,
    },
    response: new Response(null, { status }),
  };
}

describe('logout BFF', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
    vi.spyOn(Date, 'now').mockReturnValue(now);
    readAuthSessionMock.mockResolvedValue(session);
    clearAuthSessionMock.mockResolvedValue();
    logoutMock.mockResolvedValue(logoutSuccessResponse());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('revokes with the current token while the access token is usable', async () => {
    const response = await postLogout(logoutRequest());

    expect(response.status).toBe(204);
    expect(logoutMock).toHaveBeenCalledWith({
      auth: 'access-token',
      body: { refreshToken: 'refresh-token' },
    });
    expect(refreshMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('refreshes once and revokes with both newly rotated tokens when access is expired', async () => {
    readAuthSessionMock.mockResolvedValue({
      ...session,
      accessTokenExpiresAt: now - 1,
    });
    refreshMock.mockResolvedValue(refreshSuccessResponse());

    await postLogout(logoutRequest());

    expect(refreshMock).toHaveBeenCalledOnce();
    expect(logoutMock).toHaveBeenCalledWith({
      auth: 'new-access-token',
      body: { refreshToken: 'new-refresh-token' },
    });
  });

  it('refreshes and retries logout after the current access token is rejected', async () => {
    logoutMock
      .mockResolvedValueOnce(errorResponse(401))
      .mockResolvedValueOnce(logoutSuccessResponse());
    refreshMock.mockResolvedValue(refreshSuccessResponse());

    await postLogout(logoutRequest());

    expect(refreshMock).toHaveBeenCalledOnce();
    expect(logoutMock).toHaveBeenNthCalledWith(2, {
      auth: 'new-access-token',
      body: { refreshToken: 'new-refresh-token' },
    });
  });

  it('reports when logout rejects a freshly issued access token', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    readAuthSessionMock.mockResolvedValue({
      ...session,
      accessTokenExpiresAt: now - 1,
    });
    refreshMock.mockResolvedValue(refreshSuccessResponse());
    logoutMock.mockResolvedValue(errorResponse(401));

    const response = await postLogout(logoutRequest());

    expect(response.status).toBe(204);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      '[auth] Failed to revoke the backend session during logout.',
      {
        phase: 'logout',
        status: 401,
        error: 'Refreshed access token was rejected',
      },
    );
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error), {
      tags: {
        feature: 'auth',
        'http.status_code': 401,
        operation: 'logout-backend-session',
        phase: 'logout',
      },
    });
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('reports an unexpected logout exception and still clears the local session', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('logout transport failed');
    logoutMock.mockRejectedValue(error);

    const response = await postLogout(logoutRequest());

    expect(response.status).toBe(204);
    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      tags: {
        feature: 'auth',
        operation: 'logout-backend-session',
        phase: 'logout',
      },
    });
    expect(consoleErrorMock).toHaveBeenCalledOnce();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('does not retry a failed refresh token rotation', async () => {
    readAuthSessionMock.mockResolvedValue({
      ...session,
      accessTokenExpiresAt: now - 1,
    });
    refreshMock.mockResolvedValue(errorResponse(500));

    const response = await postLogout(logoutRequest());

    expect(response.status).toBe(204);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(logoutMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('retries the idempotent logout once after a transient failure', async () => {
    logoutMock
      .mockResolvedValueOnce(errorResponse(500))
      .mockResolvedValueOnce(logoutSuccessResponse());

    await postLogout(logoutRequest());

    expect(logoutMock).toHaveBeenCalledTimes(2);
    expect(refreshMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });
});
