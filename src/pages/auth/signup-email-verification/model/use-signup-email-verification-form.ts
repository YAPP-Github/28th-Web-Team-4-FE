'use client';

import { useEffect, useReducer, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { getApiErrorCode, getApiErrorMessage } from '@/shared/api/api-error';
import {
  sendSignupEmailVerificationCode,
  type SignupEmailCodeResolution,
  verifySignupEmailCode,
} from '@/pages/auth/signup-email-verification/api/signup-email-verification';
import {
  initialSignupEmailVerificationState,
  signupEmailVerificationReducer,
} from '@/pages/auth/signup-email-verification/model/signup-email-verification-reducer';
import { signupEmailVerificationSchema } from '@/pages/auth/signup-email-verification/model/signup-email-verification-schema';

const INVALID_OR_EXPIRED_CODE_MESSAGE =
  '인증 코드가 올바르지 않거나 만료되었어요. 다시 확인해 주세요.';
const GOOGLE_ACCOUNT_MESSAGE =
  'Google 계정으로 가입된 이메일이에요. Google 로그인을 이용해 주세요.';
const EXISTING_ACCOUNT_MESSAGE = '이미 가입된 이메일이에요. 로그인을 이용해 주세요.';

function getSendResolutionErrorMessage(resolution: SignupEmailCodeResolution): string | undefined {
  if (resolution === 'google') {
    return GOOGLE_ACCOUNT_MESSAGE;
  }

  if (resolution === 'login') {
    return EXISTING_ACCOUNT_MESSAGE;
  }

  return undefined;
}

export function useSignupEmailVerificationForm(email: string) {
  const router = useRouter();
  const [verificationState, dispatch] = useReducer(
    signupEmailVerificationReducer,
    initialSignupEmailVerificationState,
  );
  const initiallySentEmailRef = useRef<string | undefined>(undefined);
  const { completeEmailVerification, emailVerified, hasHydrated, startEmailSignup, storedEmail } =
    useSignupDraftStore(
      useShallow((state) => ({
        completeEmailVerification: state.completeEmailVerification,
        emailVerified: state.identity?.method === 'email' ? state.identity.emailVerified : false,
        hasHydrated: state.hasHydrated,
        startEmailSignup: state.startEmailSignup,
        storedEmail: state.identity?.email ?? '',
      })),
    );
  const initialSendMutation = useMutation({
    mutationFn: sendSignupEmailVerificationCode,
    onSuccess: (resolution) => {
      const errorMessage = getSendResolutionErrorMessage(resolution);

      if (!errorMessage) {
        return;
      }

      dispatch({ type: 'failed', errorMessage });
    },
    onError: (error) => {
      dispatch({
        type: 'failed',
        errorMessage: getApiErrorMessage(error, '인증 코드를 보내는 중 문제가 발생했습니다.'),
      });
    },
  });
  const verifyMutation = useMutation({
    mutationFn: verifySignupEmailCode,
    onSuccess: () => {
      completeEmailVerification(email);
      dispatch({ type: 'verified' });
    },
    onError: (error) => {
      dispatch({
        type: 'failed',
        errorMessage:
          getApiErrorCode(error) === 'AUTH-007'
            ? INVALID_OR_EXPIRED_CODE_MESSAGE
            : getApiErrorMessage(error, '인증 코드를 확인하는 중 문제가 발생했습니다.'),
      });
    },
  });
  const resendMutation = useMutation({
    mutationFn: sendSignupEmailVerificationCode,
    onSuccess: (resolution) => {
      const errorMessage = getSendResolutionErrorMessage(resolution);

      dispatch(errorMessage ? { type: 'failed', errorMessage } : { type: 'resendSucceeded' });
    },
    onError: (error) => {
      dispatch({
        type: 'failed',
        errorMessage: getApiErrorMessage(error, '인증 코드를 다시 보내는 중 문제가 발생했습니다.'),
      });
    },
  });
  const { code } = verificationState;
  const isVerified =
    verificationState.status === 'verified' || (storedEmail === email && emailVerified);
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

  const changeCode = (value: string) => {
    const nextCode = value.replace(/\D/g, '').slice(0, 6);
    dispatch({ type: 'codeChanged', code: nextCode });
  };

  const submit = () => {
    if (isVerified) {
      router.push('/signup/password');
      return;
    }

    const result = signupEmailVerificationSchema.safeParse({ code });

    if (!result.success) {
      dispatch({
        type: 'failed',
        errorMessage: result.error.issues[0]?.message,
      });
      return;
    }

    verifyMutation.mutate({ email, code: result.data.code });
  };

  const resendCode = () => {
    resendMutation.mutate(email);
  };

  return {
    changeCode,
    code,
    errorMessage: verificationState.errorMessage,
    isSendingCode,
    isVerified,
    isVerifying: verifyMutation.isPending,
    resendCode,
    status: verificationState.status,
    submit,
  };
}
