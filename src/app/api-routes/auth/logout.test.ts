import { logout, refresh } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { postLogout } from './logout';

vi.mock('@/shared/api/generated', () => ({
  logout: vi.fn<typeof logout>(),
  refresh: vi.fn<typeof refresh>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
}));

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
    data: { success: true, data: undefined },
    response: new Response(null, { status: 200 }),
  };
}

function refreshSuccessResponse(): Awaited<ReturnType<typeof refresh>> {
  return {
    data: { success: true, data: refreshedTokens },
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
      error: { code: 'AUTH-004', message: '인증 실패', fieldErrors: [] },
    },
    response: new Response(null, { status }),
  };
}

describe('logout BFF', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
    readAuthSessionMock.mockResolvedValue(session);
    clearAuthSessionMock.mockResolvedValue();
    logoutMock.mockResolvedValue(logoutSuccessResponse());
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
