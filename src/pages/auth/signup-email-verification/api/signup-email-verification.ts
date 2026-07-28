import { sendSignupCode, verifySignupCode } from '@/shared/api/generated';
import { getApiErrorCode } from '@/shared/api/api-error';
import { sendSignupEmailVerificationCodeResponseSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

export type SignupEmailCodeResolution = 'google' | 'login' | 'signup';

export async function sendSignupEmailVerificationCode(
  email: string,
): Promise<SignupEmailCodeResolution> {
  try {
    const { data } = await sendSignupCode({
      body: { email },
      throwOnError: true,
    });
    const result = sendSignupEmailVerificationCodeResponseSchema.safeParse(data);

    if (!result.success) {
      throw new Error('인증 코드 발송 응답 형식이 올바르지 않습니다.');
    }

    return result.data.code === 'EMAIL_ALREADY_USED_WITH_GOOGLE' ? 'google' : 'signup';
  } catch (error) {
    if (getApiErrorCode(error) === 'AUTH-002') {
      return 'login';
    }

    throw error;
  }
}

export async function verifySignupEmailCode({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<void> {
  await verifySignupCode({
    body: { email, code },
    throwOnError: true,
  });
}
