'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  type SignupAgreements,
  type SignupIdentity,
  useSignupDraftStore,
  type SignupOccupation,
} from '@/features/auth/signup-flow';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { submitSignup } from '@/pages/auth/signup-terms/api/submit-signup';

export type SignupTermsDraft = SignupAgreements & {
  identity: SignupIdentity;
  nickname: string;
  companyName: string;
  occupation?: SignupOccupation;
};

export function useSignupTermsForm(signupDraft: SignupTermsDraft) {
  const router = useRouter();
  const setStoredAgreements = useSignupDraftStore((state) => state.setAgreements);
  const resetSignupDraft = useSignupDraftStore((state) => state.resetSignupDraft);
  const [agreements, setAgreements] = useState<SignupAgreements>({
    serviceTermsAgreed: signupDraft.serviceTermsAgreed,
    privacyAgreed: signupDraft.privacyAgreed,
    marketingAgreed: signupDraft.marketingAgreed,
  });
  const [errorMessage, setErrorMessage] = useState<string>();
  const requiredAgreementsAccepted = agreements.serviceTermsAgreed && agreements.privacyAgreed;
  const signupMutation = useMutation({
    mutationFn: submitSignup,
    onSuccess: () => {
      resetSignupDraft();
      router.replace('/');
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, '회원가입 중 문제가 발생했습니다.'));
    },
  });

  const changeAgreements = (nextAgreements: SignupAgreements) => {
    setAgreements(nextAgreements);
    setErrorMessage(undefined);
  };

  const goToPreviousStep = () => {
    router.push('/signup/occupation');
  };

  const submit = () => {
    if (!requiredAgreementsAccepted || signupMutation.isPending) {
      return;
    }

    setStoredAgreements(agreements);
    const profile = {
      nickname: signupDraft.nickname,
      companyName: signupDraft.companyName,
      occupation: signupDraft.occupation,
      termsAgreed: requiredAgreementsAccepted,
      marketingAgreed: agreements.marketingAgreed,
    };

    signupMutation.mutate(
      signupDraft.identity.method === 'google'
        ? {
            method: 'google',
            body: { ...profile, signupToken: signupDraft.identity.signupToken },
          }
        : {
            method: 'email',
            body: {
              ...profile,
              email: signupDraft.identity.email,
              password: signupDraft.identity.password,
            },
          },
    );
  };

  return {
    agreements,
    canSubmit: requiredAgreementsAccepted,
    changeAgreements,
    errorMessage,
    goToPreviousStep,
    isPending: signupMutation.isPending,
    submit,
  };
}
