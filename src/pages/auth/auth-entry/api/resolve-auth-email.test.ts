import { loginMethods, sendSignupCode } from '@/shared/api/generated';

import { resolveAuthEmail } from './resolve-auth-email';

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

describe('resolveAuthEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the password login branch for a local account', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse(['LOCAL']));

    await expect(resolveAuthEmail('member@example.com')).resolves.toEqual({
      type: 'login',
      email: 'member@example.com',
    });
    expect(sendSignupCodeMock).not.toHaveBeenCalled();
  });

  it('returns the Google guidance branch for a Google-only account', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse(['GOOGLE']));

    await expect(resolveAuthEmail('google@example.com')).resolves.toEqual({
      type: 'google',
      email: 'google@example.com',
    });
    expect(sendSignupCodeMock).not.toHaveBeenCalled();
  });

  it('sends a signup code for an unregistered email', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse([]));
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true },
      response: new Response(null, { status: 200 }),
    });

    await expect(resolveAuthEmail('new@example.com')).resolves.toEqual({
      type: 'signup',
      email: 'new@example.com',
    });
    expect(sendSignupCodeMock).toHaveBeenCalledWith({
      body: { email: 'new@example.com' },
      throwOnError: true,
    });
  });

  it('returns the Google branch when code delivery finds a Google-only account', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse([]));
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, code: 'EMAIL_ALREADY_USED_WITH_GOOGLE' },
      response: new Response(null, { status: 200 }),
    });

    await expect(resolveAuthEmail('google@example.com')).resolves.toEqual({
      type: 'google',
      email: 'google@example.com',
    });
  });

  it('handles an account created between lookup and code delivery', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse([]));
    sendSignupCodeMock.mockRejectedValue({
      success: false,
      error: { code: 'AUTH-002', message: '이미 사용 중인 이메일입니다.' },
    });

    await expect(resolveAuthEmail('raced@example.com')).resolves.toEqual({
      type: 'login',
      email: 'raced@example.com',
    });
  });
});
