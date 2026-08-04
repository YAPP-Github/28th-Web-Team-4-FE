import { refresh } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/app/api-routes/auth/session-cookie';

import { postRefresh } from './refresh';

vi.mock('@/shared/api/generated', () => ({
  refresh: vi.fn<typeof refresh>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
  writeAuthSession: vi.fn<typeof writeAuthSession>(),
}));

const refreshMock = vi.mocked(refresh);
const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const writeAuthSessionMock = vi.mocked(writeAuthSession);
const now = 1_000_000;
const rotatedTokens = {
  accessToken: 'new-access-token',
  accessTokenExpiresIn: 1_800,
  refreshToken: 'new-refresh-token',
  refreshTokenExpiresIn: 7_200,
};

function refreshRequest(): Request {
  return new Request('https://chaeso-zip.com/api/auth/refresh', {
    method: 'POST',
    headers: {
      origin: 'https://chaeso-zip.com',
      'sec-fetch-site': 'same-origin',
    },
  });
}

function sessionWith(refreshToken: string): AuthSession {
  return {
    accessToken: 'access-token',
    accessTokenExpiresAt: now - 1,
    refreshToken,
    refreshTokenExpiresAt: now + 3_600_000,
  };
}

function refreshSuccessResponse(): Awaited<ReturnType<typeof refresh>> {
  return {
    data: { success: true, data: rotatedTokens },
    response: new Response(null, { status: 200 }),
  };
}

function refreshErrorResponse(status: number): Awaited<ReturnType<typeof refresh>> {
  return {
    data: undefined,
    error: {
      success: false,
      error: { code: 'AUTH-004', message: '인증 실패', fieldErrors: [] },
    },
    response: new Response(null, { status }),
  };
}

describe('refresh BFF single-flight', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
    clearAuthSessionMock.mockResolvedValue();
    writeAuthSessionMock.mockResolvedValue(sessionWith('new-refresh-token'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shares one upstream refresh result across concurrent requests', async () => {
    let resolveRefresh!: (result: Awaited<ReturnType<typeof refresh>>) => void;
    const pendingRefresh = new Promise<Awaited<ReturnType<typeof refresh>>>((resolve) => {
      resolveRefresh = resolve;
    });
    readAuthSessionMock.mockResolvedValue(sessionWith('concurrent-refresh-token'));
    refreshMock.mockReturnValue(pendingRefresh as ReturnType<typeof refresh>);

    const firstResponsePromise = postRefresh(refreshRequest());
    const secondResponsePromise = postRefresh(refreshRequest());

    await vi.waitFor(() => expect(refreshMock).toHaveBeenCalledOnce());
    resolveRefresh(refreshSuccessResponse());

    const [firstResponse, secondResponse] = await Promise.all([
      firstResponsePromise,
      secondResponsePromise,
    ]);
    const lateResponse = await postRefresh(refreshRequest());

    expect(firstResponse.status).toBe(204);
    expect(secondResponse.status).toBe(204);
    expect(lateResponse.status).toBe(204);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(writeAuthSessionMock).toHaveBeenCalledTimes(3);
    expect(writeAuthSessionMock).toHaveBeenCalledWith(rotatedTokens);
    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });

  it.each([401, 500])(
    'shares an upstream %s failure and clears each stale cookie response',
    async (status) => {
      readAuthSessionMock.mockResolvedValue(sessionWith(`invalid-refresh-token-${status}`));
      refreshMock.mockResolvedValue(refreshErrorResponse(status));

      const [firstResponse, secondResponse] = await Promise.all([
        postRefresh(refreshRequest()),
        postRefresh(refreshRequest()),
      ]);

      expect(firstResponse.status).toBe(status);
      expect(secondResponse.status).toBe(status);
      expect(refreshMock).toHaveBeenCalledOnce();
      expect(clearAuthSessionMock).toHaveBeenCalledTimes(2);
      expect(writeAuthSessionMock).not.toHaveBeenCalled();
    },
  );

  it('clears the session without retrying a rejected upstream request', async () => {
    readAuthSessionMock.mockResolvedValue(sessionWith('network-failure-refresh-token'));
    refreshMock.mockRejectedValue(new Error('network failure'));

    const response = await postRefresh(refreshRequest());

    expect(response.status).toBe(502);
    expect(refreshMock).toHaveBeenCalledOnce();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });
});
