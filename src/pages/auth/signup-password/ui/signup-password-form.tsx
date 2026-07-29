'use client';

import type { JSX } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { AuthForm } from '@/features/auth/auth-form';
import {
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { InputField } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { useSignupPasswordForm } from '@/pages/auth/signup-password/model/use-signup-password-form';

export function SignupPasswordForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('password');
  const { email, password: savedPassword } = useSignupDraftStore(
    useShallow((state) => ({
      email: state.email,
      password: state.password,
    })),
  );

  if (!canAccessStep) {
    return null;
  }

  return <HydratedSignupPasswordForm email={email} initialPassword={savedPassword} />;
}

function HydratedSignupPasswordForm({
  email,
  initialPassword,
}: {
  email: string;
  initialPassword: string;
}): JSX.Element {
  const {
    feedback,
    handlePasswordBlur,
    handlePasswordChange,
    handlePasswordConfirmationBlur,
    handlePasswordConfirmationChange,
    handlePrevious,
    handleSubmit,
    password,
    passwordConfirmation,
  } = useSignupPasswordForm({ email, initialPassword });

  return (
    <AuthForm
      actions={<SignupStepActions onPrevious={handlePrevious} />}
      title="비밀번호 설정하기"
      titleId="signup-password-title"
      onSubmit={handleSubmit}
    >
      <VStack className="gap-024 items-stretch">
        <VStack className="gap-004 items-stretch">
          <strong className="typo-heading-lg text-text-high break-all">{email}</strong>
          <p className="typo-subtitle-xxs text-text-default">로그인에 사용할 비밀번호를 설정해요</p>
        </VStack>

        <VStack className="gap-012 items-stretch">
          <InputField
            frame="password"
            name="password"
            autoComplete="new-password"
            aria-label="비밀번호"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            feedback={feedback.password}
          />
          <InputField
            frame="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            aria-label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            onBlur={handlePasswordConfirmationBlur}
            feedback={feedback.passwordConfirmation}
          />
        </VStack>
      </VStack>
    </AuthForm>
  );
}
