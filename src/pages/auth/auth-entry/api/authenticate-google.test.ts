import { googleAuth } from '@/shared/api/generated';

import { authenticateGoogle } from './authenticate-google';

vi.mock('@/shared/api/generated', () => ({
  googleAuth: vi.fn<typeof googleAuth>(),
}));

const googleAuthMock = vi.mocked(googleAuth);

describe('authenticateGoogle', () => {
  it('returns the signup token and prefilled profile for a new Google account', async () => {
    googleAuthMock.mockResolvedValue({
      data: {
        success: true,
        data: {
          status: 'SIGNUP_REQUIRED',
          signupRequired: true,
          signupToken: 'one-time-token',
          prefill: {
            email: 'google@example.com',
            suggestedNickname: '구글 사용자',
          },
        },
      },
      response: new Response(null, { status: 200 }),
    });

    await expect(authenticateGoogle('google-id-token')).resolves.toEqual({
      type: 'signup',
      email: 'google@example.com',
      nickname: '구글 사용자',
      signupToken: 'one-time-token',
    });
    expect(googleAuthMock).toHaveBeenCalledWith({
      body: { idToken: 'google-id-token' },
      throwOnError: true,
    });
  });

  it('rejects an unexpected response instead of starting an invalid signup', async () => {
    googleAuthMock.mockResolvedValue({
      data: { success: true, data: { status: 'SIGNUP_REQUIRED' } },
      response: new Response(null, { status: 200 }),
    });

    await expect(authenticateGoogle('google-id-token')).rejects.toThrow(
      'Google 인증 응답 형식이 올바르지 않습니다.',
    );
  });
});
