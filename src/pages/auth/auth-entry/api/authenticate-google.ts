import { googleAuthResolutionSchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';
import { parseJsonResponse } from '@/shared/api/response';

export type GoogleAuthResolution =
  | { type: 'login' }
  | { type: 'link'; email: string }
  | { type: 'signup'; email: string; nickname: string; signupToken: string };

export async function authenticateGoogle(idToken: string): Promise<GoogleAuthResolution> {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const body = await parseJsonResponse<unknown>(response);

  const result = googleAuthResolutionSchema.safeParse(body);

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
