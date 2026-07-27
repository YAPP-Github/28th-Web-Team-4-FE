import { loginMethods, sendSignupCode } from '@/shared/api/generated';
import { getApiErrorCode } from '@/shared/api/api-error';
import {
  loginMethodsSchema,
  sendSignupCodeResponseSchema,
} from '@/pages/auth/auth-entry/model/auth-entry-schema';

export type AuthEmailResolution =
  | { type: 'login'; email: string }
  | { type: 'google'; email: string }
  | { type: 'signup'; email: string };

export type AuthMethod = 'LOCAL' | 'GOOGLE';
export type SignupCodeResolution = AuthEmailResolution['type'];

export async function getAuthEmailMethods(email: string): Promise<AuthMethod[]> {
  const { data: response } = await loginMethods({
    body: { email },
    throwOnError: true,
  });
  const result = loginMethodsSchema.safeParse(response.data);

  if (!result.success) {
    throw new Error('로그인 수단 응답 형식이 올바르지 않습니다.');
  }

  return result.data.methods;
}

export async function sendAuthSignupCode(email: string): Promise<SignupCodeResolution> {
  try {
    const { data } = await sendSignupCode({
      body: { email },
      throwOnError: true,
    });
    const result = sendSignupCodeResponseSchema.safeParse(data);

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
