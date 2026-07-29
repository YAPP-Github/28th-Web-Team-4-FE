'use client';

import { useState, type FormEventHandler, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import {
  SignupAgreementFields,
  SignupStepActions,
  type SignupAgreements,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { AuthForm } from '@/features/auth/auth-form';
import { getApiErrorMessage } from '@/shared/api/api-error';
import type { SignupRequest } from '@/shared/api/generated/types.gen';
import { VStack } from '@/shared/ui/layout/v-stack';
import { submitSignup } from '@/pages/auth/signup-terms/api/submit-signup';

export function SignupTermsForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('terms');
  const signupDraft = useSignupDraftStore(
    useShallow((state) => ({
      email: state.email,
      password: state.password,
      nickname: state.nickname,
      companyName: state.companyName,
      occupation: state.occupation,
      serviceTermsAgreed: state.serviceTermsAgreed,
      privacyAgreed: state.privacyAgreed,
      marketingAgreed: state.marketingAgreed,
    })),
  );

  if (!canAccessStep) {
    return null;
  }

  return <HydratedSignupTermsForm signupDraft={signupDraft} />;
}

function HydratedSignupTermsForm({
  signupDraft,
}: {
  signupDraft: Omit<SignupRequest, 'marketingAgreed' | 'termsAgreed'> & SignupAgreements;
}): JSX.Element {
  const router = useRouter();
  const setStoredAgreements = useSignupDraftStore((state) => state.setAgreements);
  const resetSignupDraft = useSignupDraftStore((state) => state.resetSignupDraft);
  const [agreements, setAgreements] = useState<SignupAgreements>({
    serviceTermsAgreed: signupDraft.serviceTermsAgreed,
    privacyAgreed: signupDraft.privacyAgreed,
    marketingAgreed: signupDraft.marketingAgreed,
  });
  const [errorMessage, setErrorMessage] = useState<string>();
  const { serviceTermsAgreed, privacyAgreed } = agreements;
  const requiredAgreementsAccepted = serviceTermsAgreed && privacyAgreed;
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

  return (
    <AuthForm
      actions={
        <VStack className="gap-012 items-stretch">
          {errorMessage && (
            <p className="typo-body-lg text-sys-error-default text-center" role="alert">
              {errorMessage}
            </p>
          )}
          <SignupStepActions
            onPrevious={() => router.push('/signup/occupation')}
            previousDisabled={signupMutation.isPending}
            nextDisabled={!requiredAgreementsAccepted || signupMutation.isPending}
            nextLabel="가입하기"
          />
        </VStack>
      }
      title="약관 동의하기"
      titleId="signup-terms-title"
      onSubmit={handleSubmit}
    >
      <SignupAgreementFields agreements={agreements} onAgreementsChange={handleAgreementsChange} />
    </AuthForm>
  );
}
