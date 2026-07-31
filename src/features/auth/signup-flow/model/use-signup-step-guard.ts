'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import {
  useSignupDraftStore,
  type SignupIdentity,
  type SignupOccupation,
} from './signup-draft-store';

export type SignupStep = 'company' | 'name' | 'occupation' | 'password' | 'terms';

type SignupPrerequisites = {
  companyName: string;
  identity?: SignupIdentity;
  nickname: string;
  occupation?: SignupOccupation;
};

function getSignupStepRedirect(
  step: SignupStep,
  { companyName, identity, nickname, occupation }: SignupPrerequisites,
): string | undefined {
  if (!identity || (identity.method === 'email' && !identity.emailVerified)) {
    return '/login';
  }

  if (step === 'password' && identity.method === 'google') {
    return '/signup/name';
  }

  if (step !== 'password' && identity.method === 'email' && !identity.password) {
    return '/signup/password';
  }

  if ((step === 'company' || step === 'occupation' || step === 'terms') && !nickname) {
    return '/signup/name';
  }

  if ((step === 'occupation' || step === 'terms') && !companyName) {
    return '/signup/company';
  }

  if (step === 'terms' && !occupation) {
    return '/signup/occupation';
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
