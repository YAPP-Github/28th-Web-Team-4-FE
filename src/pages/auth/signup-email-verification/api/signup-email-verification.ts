import { sendSignupCode, verifySignupCode } from '@/shared/api/generated';

export async function sendSignupEmailVerificationCode(email: string): Promise<void> {
  await sendSignupCode({
    body: { email },
    throwOnError: true,
  });
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
