'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useSignupDraftStore } from '@/features/auth/signup-flow';
import { signupPasswordSchema } from '@/pages/auth/signup-password/model/signup-password-schema';

type SignupPasswordInput = z.input<typeof signupPasswordSchema>;
type SignupPasswordOutput = z.output<typeof signupPasswordSchema>;

export function useSignupPasswordForm({
  email,
  initialPassword,
}: {
  email: string;
  initialPassword: string;
}) {
  const router = useRouter();
  const setStoredPassword = useSignupDraftStore((state) => state.setPassword);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignupPasswordInput, unknown, SignupPasswordOutput>({
    defaultValues: {
      password: initialPassword,
      passwordConfirmation: initialPassword,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(signupPasswordSchema),
  });

  const submit = handleSubmit(({ password }) => {
    setStoredPassword(password);
    router.push('/signup/name');
  });

  const goToPreviousStep = () => {
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return {
    errors,
    goToPreviousStep,
    register,
    submit,
  };
}
