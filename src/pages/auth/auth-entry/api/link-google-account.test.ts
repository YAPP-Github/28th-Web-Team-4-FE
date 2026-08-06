import { linkGoogleAccount } from './link-google-account';

const fetchMock = vi.fn<typeof fetch>();

describe('linkGoogleAccount', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('re-sends the Google ID token to the link BFF', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(linkGoogleAccount('google-id-token')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/google/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'google-id-token' }),
    });
  });

  it('rejects an unsuccessful link response', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ error: { message: '연결 실패' } }, { status: 401 }),
    );

    await expect(linkGoogleAccount('expired-token')).rejects.toMatchObject({ status: 401 });
  });
});
