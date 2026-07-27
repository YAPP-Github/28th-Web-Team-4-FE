'use client';

import { useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getApiErrorCode, getApiErrorMessage } from '@/shared/api/api-error';
import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { BrandSymbol } from '@/shared/ui/symbol';
import {
  resendSignupEmailCode,
  verifySignupEmailCode,
} from '@/pages/auth/signup-email-verification/api/signup-email-verification';
import { signupEmailVerificationSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

const INVALID_OR_EXPIRED_CODE_MESSAGE =
  '인증 코드가 올바르지 않거나 만료되었어요. 다시 확인해 주세요.';

export function SignupEmailVerificationForm({ email }: { email: string }): JSX.Element {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<InputFieldFeedback>();
  const verifyMutation = useMutation({
    mutationFn: verifySignupEmailCode,
    onSuccess: () => {
      setFeedback({ tone: 'success', message: '인증이 완료됐어요.' });
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message:
          getApiErrorCode(error) === 'AUTH-007'
            ? INVALID_OR_EXPIRED_CODE_MESSAGE
            : getApiErrorMessage(error, '인증 코드를 확인하는 중 문제가 발생했습니다.'),
      });
    },
  });
  const resendMutation = useMutation({
    mutationFn: resendSignupEmailCode,
    onSuccess: () => {
      setCode('');
      setFeedback(undefined);
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message: getApiErrorMessage(error, '인증 코드를 다시 보내는 중 문제가 발생했습니다.'),
      });
    },
  });
  const isVerified = feedback?.tone === 'success';
  const isPending = verifyMutation.isPending || resendMutation.isPending;

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.currentTarget.value.replace(/\D/g, '').slice(0, 6));
  };

  const verifyCode = () => {
    const result = signupEmailVerificationSchema.safeParse({ code });

    if (!result.success) {
      setFeedback({ tone: 'error', message: result.error.issues[0]?.message });
      return;
    }

    verifyMutation.mutate({ email, code: result.data.code });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isVerified) {
      verifyCode();
    }
  };

  const handleResend = () => {
    resendMutation.mutate(email);
  };

  return (
    <>
      <FormPanelHeader
        graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
        title="이메일 인증하기"
        titleId="signup-email-verification-title"
      />

      <form className="gap-036 flex w-full flex-col" noValidate onSubmit={handleSubmit}>
        <div className="gap-024 flex flex-col">
          <div className="gap-004 flex flex-col">
            <strong className="typo-heading-lg text-text-high break-all">{email}</strong>
            <p className="typo-subtitle-xxs text-text-default">
              본인 확인을 위해 위 이메일로 전달된 인증 코드를 입력해 주세요.
            </p>
          </div>

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
            disabled={isPending}
            onChange={handleCodeChange}
            feedback={feedback}
          />
        </div>

        <div className="gap-012 flex flex-col">
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending || isVerified}
            onClick={handleResend}
          >
            인증 코드 다시 보내기
          </button>
          <Button
            frame="cta"
            tone="login"
            type="submit"
            disabled={code.length === 0 || isPending || isVerified}
          >
            다음
          </Button>
        </div>
      </form>
    </>
  );
}
