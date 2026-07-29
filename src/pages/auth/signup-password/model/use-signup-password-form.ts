'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import type { InputFieldFeedback } from '@/shared/ui/input-field';
import { signupPasswordSchema } from '@/pages/auth/signup-password/model/signup-password-schema';

const PASSWORD_GUIDE = '비밀번호는 8자 이상으로, 영어·숫자·특수문자를 포함해야 해요';

type PasswordField = 'password' | 'passwordConfirmation';
type PasswordFeedback = Partial<Record<PasswordField, InputFieldFeedback>>;

function getPasswordFeedback(password: string, passwordConfirmation: string): PasswordFeedback {
  const result = signupPasswordSchema.safeParse({ password, passwordConfirmation });

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<PasswordFeedback>((feedback, issue) => {
    const field = issue.path[0];

    if ((field === 'password' || field === 'passwordConfirmation') && !feedback[field]) {
      feedback[field] = { tone: 'error', message: issue.message };
    }

    return feedback;
  }, {});
}

export function useSignupPasswordForm({
  email,
  initialPassword,
}: {
  email: string;
  initialPassword: string;
}) {
  const router = useRouter();
  const setStoredPassword = useSignupDraftStore((state) => state.setPassword);
  const [password, setPassword] = useState(initialPassword);
  const [passwordConfirmation, setPasswordConfirmation] = useState(initialPassword);
  const [feedback, setFeedback] = useState<PasswordFeedback>({});
  const [touched, setTouched] = useState<Partial<Record<PasswordField, boolean>>>({});

  const validateField = (
    field: PasswordField,
    nextPassword = password,
    nextPasswordConfirmation = passwordConfirmation,
  ) => {
    const nextFeedback = getPasswordFeedback(nextPassword, nextPasswordConfirmation);
    setFeedback((current) => ({ ...current, [field]: nextFeedback[field] }));
  };

  const changePassword = (nextPassword: string) => {
    setPassword(nextPassword);

    if (touched.password || feedback.password) {
      validateField('password', nextPassword, passwordConfirmation);
    }

    if (touched.passwordConfirmation || feedback.passwordConfirmation) {
      validateField('passwordConfirmation', nextPassword, passwordConfirmation);
    }
  };

  const changePasswordConfirmation = (nextPasswordConfirmation: string) => {
    setPasswordConfirmation(nextPasswordConfirmation);

    if (touched.passwordConfirmation || feedback.passwordConfirmation) {
      validateField('passwordConfirmation', password, nextPasswordConfirmation);
    }
  };

  const validatePassword = () => {
    setTouched((current) => ({ ...current, password: true }));
    validateField('password');
  };

  const validatePasswordConfirmation = () => {
    setTouched((current) => ({ ...current, passwordConfirmation: true }));
    validateField('passwordConfirmation');
  };

  const submit = () => {
    const result = signupPasswordSchema.safeParse({ password, passwordConfirmation });

    if (!result.success) {
      setTouched({ password: true, passwordConfirmation: true });
      setFeedback(getPasswordFeedback(password, passwordConfirmation));
      return;
    }

    setStoredPassword(result.data.password);
    router.push('/signup/name');
  };

  const goToPreviousStep = () => {
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return {
    changePassword,
    changePasswordConfirmation,
    feedback: {
      password: feedback.password ?? { tone: 'info', message: PASSWORD_GUIDE },
      passwordConfirmation: feedback.passwordConfirmation,
    } satisfies PasswordFeedback,
    goToPreviousStep,
    password,
    passwordConfirmation,
    submit,
    validatePassword,
    validatePasswordConfirmation,
  };
}
