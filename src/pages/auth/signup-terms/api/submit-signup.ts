import { signup } from '@/shared/api/generated';
import type { SignupRequest } from '@/shared/api/generated/types.gen';

export async function submitSignup(body: SignupRequest): Promise<void> {
  await signup({
    body,
    throwOnError: true,
  });
}
