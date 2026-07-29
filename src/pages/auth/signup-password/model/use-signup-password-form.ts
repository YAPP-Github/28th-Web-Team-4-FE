'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { signupPasswordSchema } from '@/pages/auth/signup-password/model/signup-password-schema';

type PasswordField = 'password' | 'passwordConfirmation';
type PasswordErrors = Partial<Record<PasswordField, string>>;

function getPasswordErrors(password: string, passwordConfirmation: string): PasswordErrors {
  const result = signupPasswordSchema.safeParse({ password, passwordConfirmation });

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<PasswordErrors>((errors, issue) => {
    const field = issue.path[0];

    if ((field === 'password' || field === 'passwordConfirmation') && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
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
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [touched, setTouched] = useState<Partial<Record<PasswordField, boolean>>>({});

  const validateField = (
    field: PasswordField,
    nextPassword = password,
    nextPasswordConfirmation = passwordConfirmation,
  ) => {
    const nextErrors = getPasswordErrors(nextPassword, nextPasswordConfirmation);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };

  const changePassword = (nextPassword: string) => {
    setPassword(nextPassword);

    if (touched.password || errors.password) {
      validateField('password', nextPassword, passwordConfirmation);
    }

    if (touched.passwordConfirmation || errors.passwordConfirmation) {
      validateField('passwordConfirmation', nextPassword, passwordConfirmation);
    }
  };

  const changePasswordConfirmation = (nextPasswordConfirmation: string) => {
    setPasswordConfirmation(nextPasswordConfirmation);

    if (touched.passwordConfirmation || errors.passwordConfirmation) {
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
      setErrors(getPasswordErrors(password, passwordConfirmation));
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
    errors,
    goToPreviousStep,
    password,
    passwordConfirmation,
    submit,
    validatePassword,
    validatePasswordConfirmation,
  };
}
