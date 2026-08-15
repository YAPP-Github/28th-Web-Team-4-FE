import { getMyProfile as getBackendMyProfile, refresh } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/app/api-routes/auth/session-cookie';

import { getMyProfile as getMyProfileRoute } from './me';

vi.mock('@/shared/api/generated', () => ({
  getMyProfile: vi.fn<typeof getBackendMyProfile>(),
  refresh: vi.fn<typeof refresh>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
  writeAuthSession: vi.fn<typeof writeAuthSession>(),
}));

const getMyProfileMock = vi.mocked(getBackendMyProfile);
const refreshMock = vi.mocked(refresh);
const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const writeAuthSessionMock = vi.mocked(writeAuthSession);
const now = 1_000_000;
const session: AuthSession = {
  accessToken: 'access-token',
  accessTokenExpiresAt: now + 60_000,
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: now + 3_600_000,
};
const profile = {
  nickname: '채소러버',
  email: 'user@example.com',
  companyName: '채소컴퍼니',
  occupation: 'MARKETING' as const,
};
const refreshedSession: AuthSession = {
  accessToken: 'new-access-token',
  accessTokenExpiresAt: now + 1_800_000,
  refreshToken: 'new-refresh-token',
  refreshTokenExpiresAt: now + 7_200_000,
};

function profileSuccessResponse(): Awaited<ReturnType<typeof getBackendMyProfile>> {
  return {
    data: { success: true, data: profile, error: null, code: null },
    response: new Response(null, { status: 200 }),
  };
}

function profileErrorResponse(status: number): Awaited<ReturnType<typeof getBackendMyProfile>> {
  return {
    data: undefined,
    error: {
      success: false,
      data: null,
      error: { code: 'AUTH-004', message: '인증 정보가 올바르지 않습니다.', fieldErrors: [] },
      code: null,
    },
    response: new Response(null, { status }),
  };
}

function refreshSuccessResponse(): Awaited<ReturnType<typeof refresh>> {
  return {
    data: {
      success: true,
      data: {
        accessToken: 'new-access-token',
        accessTokenExpiresIn: 1_800,
        refreshToken: 'new-refresh-token',
        refreshTokenExpiresIn: 7_200,
      },
      error: null,
      code: null,
    },
    response: new Response(null, { status: 200 }),
  };
}

describe('my profile BFF', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
    clearAuthSessionMock.mockResolvedValue();
    readAuthSessionMock.mockResolvedValue(session);
    writeAuthSessionMock.mockResolvedValue(refreshedSession);
    getMyProfileMock.mockResolvedValue(profileSuccessResponse());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 without calling the backend when there is no session', async () => {
    readAuthSessionMock.mockResolvedValue(null);

    const response = await getMyProfileRoute();

    expect(response.status).toBe(401);
    expect(getMyProfileMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('forwards the profile response with the session access token', async () => {
    const response = await getMyProfileRoute();

    expect(response.status).toBe(200);
    expect(getMyProfileMock).toHaveBeenCalledWith({ auth: 'access-token' });
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: profile,
      error: null,
      code: null,
    });
  });

  it('refreshes an expired access token before reading the profile', async () => {
    readAuthSessionMock.mockResolvedValue({
      ...session,
      accessTokenExpiresAt: now + 10_000,
    });
    refreshMock.mockResolvedValue(refreshSuccessResponse());

    const response = await getMyProfileRoute();

    expect(response.status).toBe(200);
    expect(refreshMock).toHaveBeenCalledWith({ body: { refreshToken: 'refresh-token' } });
    expect(writeAuthSessionMock).toHaveBeenCalledOnce();
    expect(getMyProfileMock).toHaveBeenCalledWith({ auth: 'new-access-token' });
  });

  it('shares one refresh request across concurrent profile requests', async () => {
    let resolveRefresh!: (result: Awaited<ReturnType<typeof refresh>>) => void;
    const pendingRefresh = new Promise<Awaited<ReturnType<typeof refresh>>>((resolve) => {
      resolveRefresh = resolve;
    });
    readAuthSessionMock.mockResolvedValue({
      ...session,
      refreshToken: 'concurrent-profile-refresh-token',
      accessTokenExpiresAt: now + 10_000,
    });
    refreshMock.mockReturnValue(pendingRefresh as ReturnType<typeof refresh>);

    const firstResponsePromise = getMyProfileRoute();
    const secondResponsePromise = getMyProfileRoute();

    await vi.waitFor(() => expect(refreshMock).toHaveBeenCalledOnce());
    resolveRefresh(refreshSuccessResponse());

    const [firstResponse, secondResponse] = await Promise.all([
      firstResponsePromise,
      secondResponsePromise,
    ]);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(writeAuthSessionMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes once and retries when the backend rejects the access token', async () => {
    readAuthSessionMock.mockResolvedValue({
      ...session,
      refreshToken: 'retry-after-profile-401-refresh-token',
    });
    getMyProfileMock
      .mockResolvedValueOnce(profileErrorResponse(401))
      .mockResolvedValueOnce(profileSuccessResponse());
    refreshMock.mockResolvedValue(refreshSuccessResponse());

    const response = await getMyProfileRoute();

    expect(response.status).toBe(200);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(getMyProfileMock).toHaveBeenNthCalledWith(2, { auth: 'new-access-token' });
  });

  it('preserves a non-authentication backend error', async () => {
    getMyProfileMock.mockResolvedValue(profileErrorResponse(500));

    const response = await getMyProfileRoute();

    expect(response.status).toBe(500);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('clears the session when a refreshed access token is rejected', async () => {
    readAuthSessionMock.mockResolvedValue({
      ...session,
      refreshToken: 'rejected-refreshed-access-token',
      accessTokenExpiresAt: now + 10_000,
    });
    getMyProfileMock.mockResolvedValue(profileErrorResponse(401));
    refreshMock.mockResolvedValue(refreshSuccessResponse());

    const response = await getMyProfileRoute();

    expect(response.status).toBe(401);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });
});
