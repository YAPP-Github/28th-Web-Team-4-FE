import {
  getAuthSession,
  logoutAuthSession,
  refreshAuthSession,
  withdrawAuthAccount,
} from './auth-session';

describe('auth session api', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the current authenticated session without caching', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ authenticated: true, accessTokenExpiresAt: 123_456 }),
    );

    await expect(getAuthSession()).resolves.toEqual({
      authenticated: true,
      accessTokenExpiresAt: 123_456,
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/session', {
      cache: 'no-store',
      credentials: 'same-origin',
    });
  });

  it('rejects an invalid session response', async () => {
    fetchMock.mockResolvedValue(Response.json({ authenticated: true }));

    await expect(getAuthSession()).rejects.toThrow('Invalid input');
  });

  it.each([
    ['refresh', refreshAuthSession, '/api/auth/refresh'],
    ['logout', logoutAuthSession, '/api/auth/logout'],
    ['withdraw', withdrawAuthAccount, '/api/auth/withdraw'],
  ] as const)('posts the %s mutation to its BFF route', async (_name, request, url) => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(request()).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(url, {
      method: 'POST',
      credentials: 'same-origin',
    });
  });

  it('passes an abort signal to the logout BFF request', async () => {
    const controller = new AbortController();
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(logoutAuthSession(controller.signal)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      signal: controller.signal,
    });
  });
});
