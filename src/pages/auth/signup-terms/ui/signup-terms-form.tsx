'use client';

import { useState, type FormEventHandler, type JSX } from 'react';
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

export function SignupTermsForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('terms');
  const agreements = useSignupDraftStore(
    useShallow((state) => ({
      serviceTermsAgreed: state.serviceTermsAgreed,
      privacyAgreed: state.privacyAgreed,
      marketingAgreed: state.marketingAgreed,
    })),
  );

  if (!canAccessStep) {
    return null;
  }

  return <HydratedSignupTermsForm initialAgreements={agreements} />;
}

function HydratedSignupTermsForm({
  initialAgreements,
}: {
  initialAgreements: SignupAgreements;
}): JSX.Element {
  const router = useRouter();
  const setStoredAgreements = useSignupDraftStore((state) => state.setAgreements);
  const [agreements, setAgreements] = useState(initialAgreements);
  const { serviceTermsAgreed, privacyAgreed } = agreements;
  const requiredAgreementsAccepted = serviceTermsAgreed && privacyAgreed;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!requiredAgreementsAccepted) {
      return;
    }

    setStoredAgreements(agreements);
  };

  return (
    <AuthForm
      actions={
        <SignupStepActions
          onPrevious={() => router.push('/signup/occupation')}
          nextDisabled={!requiredAgreementsAccepted}
          nextLabel="가입하기"
        />
      }
      title="약관 동의하기"
      titleId="signup-terms-title"
      onSubmit={handleSubmit}
    >
      <SignupAgreementFields agreements={agreements} onAgreementsChange={setAgreements} />
    </AuthForm>
  );
}
