import type { GoogleSignupRequest, SignupRequest } from '@/shared/api/generated/types.gen';
import { ensureResponseOk } from '@/shared/api/response';

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

    await ensureResponseOk(response);

    return;
  }

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request.body),
  });

  await ensureResponseOk(response);
}
