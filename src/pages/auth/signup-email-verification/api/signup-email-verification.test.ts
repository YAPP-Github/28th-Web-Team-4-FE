import { sendSignupCode, verifySignupCode } from '@/shared/api/generated';

import {
  sendSignupEmailVerificationCode,
  verifySignupEmailCode,
} from './signup-email-verification';

vi.mock('@/shared/api/generated', () => ({
  sendSignupCode: vi.fn<typeof sendSignupCode>(),
  verifySignupCode: vi.fn<typeof verifySignupCode>(),
}));

const sendSignupCodeMock = vi.mocked(sendSignupCode);
const verifySignupCodeMock = vi.mocked(verifySignupCode);

describe('signup email verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the signup branch after sending the code', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, data: null, error: null, code: null },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendSignupEmailVerificationCode('new@example.com')).resolves.toBe('signup');
    expect(sendSignupCodeMock).toHaveBeenCalledWith({
      body: { email: 'new@example.com' },
      throwOnError: true,
    });
  });

  it('returns the Google branch without treating the response as a sent code', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, data: null, error: null, code: 'EMAIL_ALREADY_USED_WITH_GOOGLE' },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendSignupEmailVerificationCode('google@example.com')).resolves.toBe('google');
  });

  it('returns the login branch when the account is registered before delivery', async () => {
    sendSignupCodeMock.mockRejectedValue({
      success: false,
      error: { code: 'AUTH-002', message: '이미 사용 중인 이메일입니다.' },
    });

    await expect(sendSignupEmailVerificationCode('member@example.com')).resolves.toBe('login');
  });

  it('rejects an unexpected send-code response', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: true, data: null, error: null, code: 'UNKNOWN_CODE' },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendSignupEmailVerificationCode('new@example.com')).rejects.toThrow(
      '인증 코드 발송 응답 형식이 올바르지 않습니다.',
    );
  });

  it('rejects an unsuccessful send-code response', async () => {
    sendSignupCodeMock.mockResolvedValue({
      data: { success: false, data: null, error: null, code: null },
      response: new Response(null, { status: 200 }),
    });

    await expect(sendSignupEmailVerificationCode('new@example.com')).rejects.toThrow(
      '인증 코드 발송 응답 형식이 올바르지 않습니다.',
    );
  });

  it('verifies the signup code', async () => {
    verifySignupCodeMock.mockResolvedValue({
      data: { success: true, data: null, error: null, code: null },
      response: new Response(null, { status: 200 }),
    });

    await expect(
      verifySignupEmailCode({ email: 'new@example.com', code: '123456' }),
    ).resolves.toBeUndefined();
    expect(verifySignupCodeMock).toHaveBeenCalledWith({
      body: { email: 'new@example.com', code: '123456' },
      throwOnError: true,
    });
  });
});
