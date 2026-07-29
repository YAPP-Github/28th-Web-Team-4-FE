'use client';

import { useState, type FormEventHandler } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  type SignupAgreements,
  useSignupDraftStore,
  type SignupOccupation,
} from '@/features/auth/signup-flow';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { submitSignup } from '@/pages/auth/signup-terms/api/submit-signup';

export type SignupTermsDraft = SignupAgreements & {
  email: string;
  password: string;
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

  const handleAgreementsChange = (nextAgreements: SignupAgreements) => {
    setAgreements(nextAgreements);
    setErrorMessage(undefined);
  };

  const handlePrevious = () => {
    router.push('/signup/occupation');
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!requiredAgreementsAccepted || signupMutation.isPending) {
      return;
    }

    setStoredAgreements(agreements);
    signupMutation.mutate({
      email: signupDraft.email,
      password: signupDraft.password,
      nickname: signupDraft.nickname,
      companyName: signupDraft.companyName,
      occupation: signupDraft.occupation,
      termsAgreed: requiredAgreementsAccepted,
      marketingAgreed: agreements.marketingAgreed,
    });
  };

  return {
    agreements,
    canSubmit: requiredAgreementsAccepted,
    errorMessage,
    handleAgreementsChange,
    handlePrevious,
    handleSubmit,
    isPending: signupMutation.isPending,
  };
}
