import { authenticateGoogle } from './authenticate-google';

const fetchMock = vi.fn<typeof fetch>();

describe('authenticateGoogle', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the signup token and prefilled profile for a new Google account', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        status: 'SIGNUP_REQUIRED',
        signupToken: 'one-time-token',
        prefill: {
          email: 'google@example.com',
          suggestedNickname: '구글 사용자',
        },
      }),
    );

    await expect(authenticateGoogle('google-id-token')).resolves.toEqual({
      type: 'signup',
      email: 'google@example.com',
      nickname: '구글 사용자',
      signupToken: 'one-time-token',
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'google-id-token' }),
    });
  });

  it('rejects an unexpected response instead of starting an invalid signup', async () => {
    fetchMock.mockResolvedValue(Response.json({ status: 'SIGNUP_REQUIRED' }));

    await expect(authenticateGoogle('google-id-token')).rejects.toThrow(
      'Google 인증 응답 형식이 올바르지 않습니다.',
    );
  });
});
