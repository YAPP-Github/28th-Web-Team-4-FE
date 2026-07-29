'use client';

import type { JSX } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { AuthForm } from '@/features/auth/auth-form';
import {
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { useSignupPasswordForm } from '@/pages/auth/signup-password/model/use-signup-password-form';

const PASSWORD_GUIDE = '비밀번호는 8자 이상으로, 영어·숫자·특수문자를 포함해야 해요';

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
    changePassword,
    changePasswordConfirmation,
    errors,
    goToPreviousStep,
    password,
    passwordConfirmation,
    submit,
    validatePassword,
    validatePasswordConfirmation,
  } = useSignupPasswordForm({ email, initialPassword });
  const passwordFeedback: InputFieldFeedback = errors.password
    ? { tone: 'error', message: errors.password }
    : { tone: 'info', message: PASSWORD_GUIDE };
  const passwordConfirmationFeedback: InputFieldFeedback | undefined = errors.passwordConfirmation
    ? { tone: 'error', message: errors.passwordConfirmation }
    : undefined;

  return (
    <AuthForm
      actions={<SignupStepActions onPrevious={goToPreviousStep} />}
      title="비밀번호 설정하기"
      titleId="signup-password-title"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
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
            onChange={(event) => changePassword(event.currentTarget.value)}
            onBlur={validatePassword}
            feedback={passwordFeedback}
          />
          <InputField
            frame="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            aria-label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={passwordConfirmation}
            onChange={(event) => changePasswordConfirmation(event.currentTarget.value)}
            onBlur={validatePasswordConfirmation}
            feedback={passwordConfirmationFeedback}
          />
        </VStack>
      </VStack>
    </AuthForm>
  );
}
