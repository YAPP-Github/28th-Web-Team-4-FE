import { redirect } from 'next/navigation';

import { resolveAuthReturnPath } from '@/pages/auth/auth-entry/model/resolve-auth-return-path';
import { signupEmailSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

import { SignupEmailVerificationForm } from './signup-email-verification-form';

type SignupEmailVerificationPageProps = {
  searchParams: Promise<{ email?: string | string[]; returnTo?: string | string[] }>;
};

export async function SignupEmailVerificationPage({
  searchParams,
}: SignupEmailVerificationPageProps) {
  const { email: emailParam, returnTo } = await searchParams;
  const result = signupEmailSchema.safeParse(typeof emailParam === 'string' ? emailParam : '');

  if (!result.success) {
    redirect('/login');
  }

  return (
    <SignupEmailVerificationForm email={result.data} returnTo={resolveAuthReturnPath(returnTo)} />
  );
}
