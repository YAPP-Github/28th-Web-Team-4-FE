import { googleAuth } from '@/shared/api/generated';
import { googleAuthResolutionSchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';

export type GoogleAuthResolution =
  | { type: 'login' }
  | { type: 'link'; email: string }
  | { type: 'signup'; email: string; nickname: string; signupToken: string };

export async function authenticateGoogle(idToken: string): Promise<GoogleAuthResolution> {
  const { data: response } = await googleAuth({
    body: { idToken },
    throwOnError: true,
  });
  const result = googleAuthResolutionSchema.safeParse(response.data);

  if (!result.success) {
    throw new Error('Google 인증 응답 형식이 올바르지 않습니다.');
  }

  if (result.data.status === 'SIGNUP_REQUIRED') {
    return {
      type: 'signup',
      email: result.data.prefill.email,
      nickname: result.data.prefill.suggestedNickname,
      signupToken: result.data.signupToken,
    };
  }

  return result.data.status === 'LINK_REQUIRED'
    ? { type: 'link', email: result.data.email }
    : { type: 'login' };
}
