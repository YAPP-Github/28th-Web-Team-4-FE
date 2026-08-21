'use client';

import type { JSX } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { AuthForm } from '@/features/auth/auth-form';
import {
  SignupAgreementFields,
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { VStack } from '@/shared/ui/layout/v-stack';
import {
  type SignupTermsDraft,
  useSignupTermsForm,
} from '@/pages/auth/signup-terms/model/use-signup-terms-form';

export function SignupTermsForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('terms');
  const signupDraft = useSignupDraftStore(
    useShallow((state) => ({
      returnTo: state.returnTo,
      identity: state.identity,
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

  if (!signupDraft.identity) {
    return null;
  }

  return (
    <HydratedSignupTermsForm signupDraft={{ ...signupDraft, identity: signupDraft.identity }} />
  );
}

function HydratedSignupTermsForm({ signupDraft }: { signupDraft: SignupTermsDraft }): JSX.Element {
  const {
    agreements,
    canSubmit,
    changeAgreements,
    errorMessage,
    goToPreviousStep,
    isPending,
    submit,
  } = useSignupTermsForm(signupDraft);

  return (
    <AuthForm
      actions={
        <VStack className="gap-012 items-stretch">
          {errorMessage ? (
            <p className="typo-body-lg text-sys-error-default text-center" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <SignupStepActions
            onPrevious={goToPreviousStep}
            previousDisabled={isPending}
            nextDisabled={!canSubmit || isPending}
            nextLabel="가입하기"
          />
        </VStack>
      }
      title="약관 동의하기"
      titleId="signup-terms-title"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <SignupAgreementFields agreements={agreements} onAgreementsChange={changeAgreements} />
    </AuthForm>
  );
}
