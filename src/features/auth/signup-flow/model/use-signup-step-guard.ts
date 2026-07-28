'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { useSignupDraftStore } from './signup-draft-store';

export type SignupStep = 'company' | 'name' | 'occupation' | 'password';

type SignupPrerequisites = {
  email: string;
  emailVerified: boolean;
  nickname: string;
  password: string;
};

function getSignupStepRedirect(
  step: SignupStep,
  { email, emailVerified, nickname, password }: SignupPrerequisites,
): string | undefined {
  if (!email || !emailVerified) {
    return '/login';
  }

  if (step !== 'password' && !password) {
    return '/signup/password';
  }

  if ((step === 'company' || step === 'occupation') && !nickname) {
    return '/signup/name';
  }

  return undefined;
}

export function useSignupStepGuard(step: SignupStep): boolean {
  const router = useRouter();
  const { hasHydrated, redirectPath } = useSignupDraftStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      redirectPath: getSignupStepRedirect(step, state),
    })),
  );

  useEffect(() => {
    if (hasHydrated && redirectPath) {
      router.replace(redirectPath);
    }
  }, [hasHydrated, redirectPath, router]);

  return hasHydrated && !redirectPath;
}
