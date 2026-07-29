'use client';

import type { JSX } from 'react';

import { AuthForm } from '@/features/auth/auth-form';
import { Button } from '@/shared/ui/button';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { useSignupEmailVerificationForm } from '@/pages/auth/signup-email-verification/model/use-signup-email-verification-form';

function getVerificationFeedback(
  status: 'error' | 'verified' | 'waiting',
  errorMessage?: string,
): InputFieldFeedback | undefined {
  if (status === 'verified') {
    return { tone: 'success', message: '인증이 완료됐어요.' };
  }

  if (status === 'error') {
    return { tone: 'error', message: errorMessage };
  }

  return undefined;
}

export function SignupEmailVerificationForm({ email }: { email: string }): JSX.Element {
  const {
    changeCode,
    code,
    errorMessage,
    isSendingCode,
    isVerified,
    isVerifying,
    resendCode,
    status,
    submit,
  } = useSignupEmailVerificationForm(email);
  const feedback = getVerificationFeedback(status, errorMessage);

  return (
    <AuthForm
      actions={
        <VStack className="gap-012 items-stretch">
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSendingCode || isVerifying || isVerified}
            onClick={resendCode}
          >
            인증 코드 다시 보내기
          </button>
          <Button
            frame="cta"
            tone="login"
            type="submit"
            disabled={(!isVerified && code.length === 0) || isVerifying}
          >
            다음
          </Button>
        </VStack>
      }
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      title="이메일 인증하기"
      titleId="signup-email-verification-title"
    >
      <VStack className="gap-024 items-stretch">
        <VStack className="gap-004 items-stretch">
          <strong className="typo-heading-lg text-text-high break-all">{email}</strong>
          <p className="typo-subtitle-xxs text-text-default">
            본인 확인을 위해 위 이메일로 전달된 인증 코드를 입력해 주세요.
          </p>
        </VStack>

        <InputField
          name="verificationCode"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          aria-label="인증 코드"
          placeholder="인증 코드를 입력해 주세요"
          value={code}
          readOnly={isVerified}
          disabled={isVerifying}
          onChange={(event) => changeCode(event.currentTarget.value)}
          feedback={feedback}
        />
      </VStack>
    </AuthForm>
  );
}
