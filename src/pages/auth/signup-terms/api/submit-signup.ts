import { signup } from '@/shared/api/generated';
import type { GoogleSignupRequest, SignupRequest } from '@/shared/api/generated/types.gen';

export type SubmitSignupRequest =
  | { method: 'email'; body: SignupRequest }
  | { method: 'google'; body: GoogleSignupRequest };

export async function submitSignup(request: SubmitSignupRequest): Promise<void> {
  if (request.method === 'google') {
    const response = await fetch('/api/auth/signup/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return;
  }

  await signup({ body: request.body, throwOnError: true });
}
