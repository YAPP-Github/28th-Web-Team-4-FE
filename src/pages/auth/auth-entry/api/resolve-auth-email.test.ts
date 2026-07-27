import { loginMethods, sendSignupCode } from '@/shared/api/generated';

import { getAuthEmailMethods, sendAuthSignupCode } from './resolve-auth-email';

vi.mock('@/shared/api/generated', () => ({
  loginMethods: vi.fn<typeof loginMethods>(),
  sendSignupCode: vi.fn<typeof sendSignupCode>(),
}));

const loginMethodsMock = vi.mocked(loginMethods);
const sendSignupCodeMock = vi.mocked(sendSignupCode);

function loginMethodsResponse(methods: ('LOCAL' | 'GOOGLE')[]) {
  return {
    data: { success: true, data: { methods } },
    response: new Response(null, { status: 200 }),
  };
}

describe('auth email API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the available login methods for an account', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse(['LOCAL']));

    await expect(getAuthEmailMethods('member@example.com')).resolves.toEqual(['LOCAL']);
    expect(sendSignupCodeMock).not.toHaveBeenCalled();
  });

  it('sends a signup code for an unregistered email', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendAuthSignupCode('new@example.com')).resolves.toBe('signup');
    expect(sendSignupCodeMock).toHaveBeenCalledWith({
      body: { email: 'new@example.com' },
      throwOnError: true,
    });
  });

  it('returns the Google branch when code delivery finds a Google-only account', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, code: 'EMAIL_ALREADY_USED_WITH_GOOGLE' },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendAuthSignupCode('google@example.com')).resolves.toBe('google');
  });

  it('rejects an unexpected signup code response', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, code: 'UNKNOWN_CODE' },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendAuthSignupCode('new@example.com')).rejects.toThrow(
      '인증 코드 발송 응답 형식이 올바르지 않습니다.',
    );
  });

  it('handles an account created between lookup and code delivery', async () => {
    sendSignupCodeMock.mockRejectedValue({
      success: false,
      error: { code: 'AUTH-002', message: '이미 사용 중인 이메일입니다.' },
    });

    await expect(sendAuthSignupCode('raced@example.com')).resolves.toBe('login');
  });
});
