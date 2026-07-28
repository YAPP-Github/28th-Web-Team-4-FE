'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { getApiErrorCode, getApiErrorMessage } from '@/shared/api/api-error';
import { Button } from '@/shared/ui/button';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { BrandSymbol } from '@/shared/ui/symbol';
import {
  sendSignupEmailVerificationCode,
  type SignupEmailCodeResolution,
  verifySignupEmailCode,
} from '@/pages/auth/signup-email-verification/api/signup-email-verification';
import { signupEmailVerificationSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

const INVALID_OR_EXPIRED_CODE_MESSAGE =
  '인증 코드가 올바르지 않거나 만료되었어요. 다시 확인해 주세요.';
const GOOGLE_ACCOUNT_MESSAGE =
  'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.';
const EXISTING_ACCOUNT_MESSAGE = '이미 가입된 이메일이에요. 로그인을 이용해 주세요.';

type VerificationState = {
  code: string;
  status: 'error' | 'verified' | 'waiting';
  errorMessage?: string;
};

function getVerificationFeedback({
  status,
  errorMessage,
}: VerificationState): InputFieldFeedback | undefined {
  if (status === 'verified') {
    return { tone: 'success', message: '인증이 완료됐어요.' };
  }

  if (status === 'error') {
    return { tone: 'error', message: errorMessage };
  }

  return undefined;
}

function getSendResolutionErrorMessage(resolution: SignupEmailCodeResolution): string | undefined {
  if (resolution === 'google') {
    return GOOGLE_ACCOUNT_MESSAGE;
  }

  if (resolution === 'login') {
    return EXISTING_ACCOUNT_MESSAGE;
  }

  return undefined;
}

export function SignupEmailVerificationForm({ email }: { email: string }): JSX.Element {
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    code: '',
    status: 'waiting',
  });
  const initiallySentEmailRef = useRef<string | undefined>(undefined);
  const storedEmail = useSignupDraftStore((state) => state.email);
  const emailVerified = useSignupDraftStore((state) => state.emailVerified);
  const hasHydrated = useSignupDraftStore((state) => state.hasHydrated);
  const startEmailSignup = useSignupDraftStore((state) => state.startEmailSignup);
  const completeEmailVerification = useSignupDraftStore((state) => state.completeEmailVerification);
  const initialSendMutation = useMutation({
    mutationFn: sendSignupEmailVerificationCode,
    onSuccess: (resolution) => {
      const errorMessage = getSendResolutionErrorMessage(resolution);

      if (!errorMessage) {
        return;
      }

      setVerificationState((previousState) =>
        previousState.status === 'verified'
          ? previousState
          : {
              ...previousState,
              status: 'error',
              errorMessage,
            },
      );
    },
    onError: (error) => {
      setVerificationState((previousState) =>
        previousState.status === 'verified'
          ? previousState
          : {
              ...previousState,
              status: 'error',
              errorMessage: getApiErrorMessage(error, '인증 코드를 보내는 중 문제가 발생했습니다.'),
            },
      );
    },
  });
  const verifyMutation = useMutation({
    mutationFn: verifySignupEmailCode,
    onSuccess: () => {
      completeEmailVerification(email);
      setVerificationState((previousState) => ({
        ...previousState,
        status: 'verified',
        errorMessage: undefined,
      }));
    },
    onError: (error) => {
      setVerificationState((previousState) => ({
        ...previousState,
        status: 'error',
        errorMessage:
          getApiErrorCode(error) === 'AUTH-007'
            ? INVALID_OR_EXPIRED_CODE_MESSAGE
            : getApiErrorMessage(error, '인증 코드를 확인하는 중 문제가 발생했습니다.'),
      }));
    },
  });
  const resendMutation = useMutation({
    mutationFn: sendSignupEmailVerificationCode,
    onSuccess: (resolution) => {
      const errorMessage = getSendResolutionErrorMessage(resolution);

      setVerificationState((previousState) => {
        if (previousState.status === 'verified') {
          return previousState;
        }

        return errorMessage
          ? {
              ...previousState,
              status: 'error',
              errorMessage,
            }
          : {
              code: '',
              status: 'waiting',
            };
      });
    },
    onError: (error) => {
      setVerificationState((previousState) =>
        previousState.status === 'verified'
          ? previousState
          : {
              ...previousState,
              status: 'error',
              errorMessage: getApiErrorMessage(
                error,
                '인증 코드를 다시 보내는 중 문제가 발생했습니다.',
              ),
            },
      );
    },
  });
  const { code } = verificationState;
  const isVerified =
    verificationState.status === 'verified' || (storedEmail === email && emailVerified);
  const feedback = getVerificationFeedback(verificationState);
  const isSendingCode = initialSendMutation.isPending || resendMutation.isPending;
  const { mutate: sendInitialCode } = initialSendMutation;

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    startEmailSignup(email);

    if ((storedEmail === email && emailVerified) || initiallySentEmailRef.current === email) {
      return;
    }

    initiallySentEmailRef.current = email;
    sendInitialCode(email);
  }, [email, emailVerified, hasHydrated, sendInitialCode, startEmailSignup, storedEmail]);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCode = event.currentTarget.value.replace(/\D/g, '').slice(0, 6);
    setVerificationState((previousState) => ({
      ...previousState,
      code: nextCode,
    }));
  };

  const verifyCode = () => {
    const result = signupEmailVerificationSchema.safeParse({ code });

    if (!result.success) {
      setVerificationState((previousState) => ({
        ...previousState,
        status: 'error',
        errorMessage: result.error.issues[0]?.message,
      }));
      return;
    }

    verifyMutation.mutate({ email, code: result.data.code });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isVerified) {
      router.push('/signup/password');
      return;
    }

    verifyCode();
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
            disabled={verifyMutation.isPending}
            onChange={handleCodeChange}
            feedback={feedback}
          />
        </div>

        <div className="gap-012 flex flex-col">
          <button
            type="button"
            className="typo-subtitle-xxs text-text-medium self-center underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSendingCode || verifyMutation.isPending || isVerified}
            onClick={handleResend}
          >
            인증 코드 다시 보내기
          </button>
          <Button
            frame="cta"
            tone="login"
            type="submit"
            disabled={(!isVerified && code.length === 0) || verifyMutation.isPending}
          >
            다음
          </Button>
        </div>
      </form>
    </>
  );
}
