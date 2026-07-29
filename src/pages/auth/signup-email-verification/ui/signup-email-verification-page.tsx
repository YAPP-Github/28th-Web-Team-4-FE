import { redirect } from 'next/navigation';

import { signupEmailSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

import { SignupEmailVerificationForm } from './signup-email-verification-form';

type SignupEmailVerificationPageProps = {
  searchParams: Promise<{ email?: string | string[] }>;
};

export async function SignupEmailVerificationPage({
  searchParams,
}: SignupEmailVerificationPageProps) {
  const emailParam = (await searchParams).email;
  const result = signupEmailSchema.safeParse(typeof emailParam === 'string' ? emailParam : '');

  if (!result.success) {
    redirect('/login');
  }

  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <SignupEmailVerificationForm email={result.data} />
    </main>
  );
}
