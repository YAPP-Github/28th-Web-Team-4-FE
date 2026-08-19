import { withdraw } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { postWithdraw } from './withdraw';

vi.mock('@/shared/api/generated', () => ({
  refresh: vi.fn<() => Promise<unknown>>(),
  withdraw: vi.fn<typeof withdraw>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
  writeAuthSession: vi.fn<() => Promise<unknown>>(),
}));

const withdrawMock = vi.mocked(withdraw);
const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const now = 1_000_000;
const session: AuthSession = {
  accessToken: 'access-token',
  accessTokenExpiresAt: now + 60_000,
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: now + 3_600_000,
};

function withdrawRequest(headers: Record<string, string> = {}): Request {
  return new Request('https://chaeso-zip.com/api/auth/withdraw', {
    method: 'POST',
    headers: {
      origin: 'https://chaeso-zip.com',
      'sec-fetch-site': 'same-origin',
      ...headers,
    },
  });
}

function successResponse(): Awaited<ReturnType<typeof withdraw>> {
  return {
    data: {
      success: true,
      data: { withdrawnAt: new Date(now).toISOString() },
      error: null,
      code: null,
    },
    response: new Response(null, { status: 200 }),
  };
}

function errorResponse(status: number): Awaited<ReturnType<typeof withdraw>> {
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

describe('withdraw BFF', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
    vi.spyOn(Date, 'now').mockReturnValue(now);
    readAuthSessionMock.mockResolvedValue(session);
    clearAuthSessionMock.mockResolvedValue();
    withdrawMock.mockResolvedValue(successResponse());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('withdraws with the current access token and clears the local session', async () => {
    const response = await postWithdraw(withdrawRequest());

    expect(response.status).toBe(204);
    expect(withdrawMock).toHaveBeenCalledWith({ auth: 'access-token' });
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('rejects cross-origin mutations before calling the backend', async () => {
    const response = await postWithdraw(
      withdrawRequest({
        origin: 'https://attacker.example',
        'sec-fetch-site': 'cross-site',
      }),
    );

    expect(response.status).toBe(403);
    expect(withdrawMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });

  it('returns unauthorized and clears an absent session', async () => {
    readAuthSessionMock.mockResolvedValue(null);

    const response = await postWithdraw(withdrawRequest());

    expect(response.status).toBe(401);
    expect(withdrawMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('forwards backend errors without clearing the active session', async () => {
    withdrawMock.mockResolvedValue(errorResponse(500));

    const response = await postWithdraw(withdrawRequest());

    expect(response.status).toBe(500);
    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });
});
