import { signup, signupGoogle } from '@/shared/api/generated';
import type { GoogleSignupRequest, SignupRequest } from '@/shared/api/generated/types.gen';

export type SubmitSignupRequest =
  | { method: 'email'; body: SignupRequest }
  | { method: 'google'; body: GoogleSignupRequest };

export async function submitSignup(request: SubmitSignupRequest): Promise<void> {
  if (request.method === 'google') {
    await signupGoogle({
      body: request.body,
      throwOnError: true,
    });
    return;
  }

  await signup({ body: request.body, throwOnError: true });
}
