import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { refreshAuthSession } from '@/app/api-routes/auth/session-refresh';

import { proxyBackendRequest } from './backend-proxy';

vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
}));
vi.mock('@/app/api-routes/auth/session-refresh', () => ({
  refreshAuthSession: vi.fn<typeof refreshAuthSession>(),
}));

const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const refreshAuthSessionMock = vi.mocked(refreshAuthSession);
const fetchMock = vi.fn<typeof fetch>();
const now = 1_000_000;

function sessionWith(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    accessToken: 'access-token',
    accessTokenExpiresAt: now + 60_000,
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: now + 3_600_000,
    ...overrides,
  };
}

function context(path: string[]): { params: Promise<{ path: string[] }> } {
  return { params: Promise.resolve({ path }) };
}

function trustedMutationRequest(body: string): Request {
  return new Request('https://chaeso-zip.com/api/backend/api/v1/recommendations', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer client-supplied-token',
      'Content-Type': 'application/json',
      origin: 'https://chaeso-zip.com',
      'sec-fetch-site': 'same-origin',
    },
    body,
  });
}

describe('backend API proxy', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.chaeso-zip.com');
    vi.spyOn(Date, 'now').mockReturnValue(now);
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    clearAuthSessionMock.mockReset();
    readAuthSessionMock.mockReset();
    refreshAuthSessionMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('adds the session JWT to the upstream request instead of trusting a client header', async () => {
    readAuthSessionMock.mockResolvedValue(sessionWith());
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await proxyBackendRequest(
      trustedMutationRequest(JSON.stringify({ onboardingId: 'onboarding-1' })),
      context(['api', 'v1', 'recommendations']),
    );
    const [url, init] = fetchMock.mock.calls[0] ?? [];

    expect(response.status).toBe(200);
    expect(url).toEqual(new URL('https://api.chaeso-zip.com/api/v1/recommendations'));
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer access-token');
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
    expect(new Headers(init?.headers).get('Origin')).toBeNull();
    await expect(new Response(init?.body).json()).resolves.toEqual({
      onboardingId: 'onboarding-1',
    });
  });

  it('forwards public requests without an Authorization header when no session exists', async () => {
    readAuthSessionMock.mockResolvedValue(null);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    await proxyBackendRequest(
      new Request('https://chaeso-zip.com/api/backend/api/v1/channels'),
      context(['api', 'v1', 'channels']),
    );
    const [, init] = fetchMock.mock.calls[0] ?? [];

    expect(new Headers(init?.headers).get('Authorization')).toBeNull();
  });

  it('refreshes once and retries a request rejected with 401', async () => {
    const currentSession = sessionWith();
    const refreshedSession = sessionWith({
      accessToken: 'refreshed-access-token',
      refreshToken: 'refreshed-refresh-token',
    });
    readAuthSessionMock.mockResolvedValue(currentSession);
    refreshAuthSessionMock.mockResolvedValue({ session: refreshedSession });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 })).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await proxyBackendRequest(
      new Request('https://chaeso-zip.com/api/backend/api/v1/users/me'),
      context(['api', 'v1', 'users', 'me']),
    );
    const [, retryInit] = fetchMock.mock.calls[1] ?? [];

    expect(response.status).toBe(200);
    expect(refreshAuthSessionMock).toHaveBeenCalledWith(currentSession);
    expect(new Headers(retryInit?.headers).get('Authorization')).toBe(
      'Bearer refreshed-access-token',
    );
  });

  it('rejects mutations from an untrusted origin', async () => {
    readAuthSessionMock.mockResolvedValue(sessionWith());

    const response = await proxyBackendRequest(
      new Request('https://chaeso-zip.com/api/backend/api/v1/recommendations', {
        method: 'POST',
        headers: {
          origin: 'https://attacker.example',
          'sec-fetch-site': 'cross-site',
        },
        body: '{}',
      }),
      context(['api', 'v1', 'recommendations']),
    );

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(readAuthSessionMock).not.toHaveBeenCalled();
  });

  it('rejects dot segments that could escape the API path prefix', async () => {
    readAuthSessionMock.mockResolvedValue(sessionWith());

    const response = await proxyBackendRequest(
      new Request('https://chaeso-zip.com/api/backend/api/v1/%2E%2E/admin'),
      context(['api', 'v1', '..', 'admin']),
    );

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(readAuthSessionMock).not.toHaveBeenCalled();
  });
});
