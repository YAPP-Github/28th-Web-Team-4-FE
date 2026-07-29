'use client';

import type { JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { AuthForm } from '@/features/auth/auth-form';
import { InputField } from '@/shared/ui/input-field';
import { signupNameSchema } from '@/pages/auth/signup-name/model/signup-name-schema';

type SignupNameInput = z.input<typeof signupNameSchema>;
type SignupNameOutput = z.output<typeof signupNameSchema>;

export function SignupNameForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('name');
  const savedNickname = useSignupDraftStore((state) => state.nickname);

  if (!canAccessStep) {
    return null;
  }

  return <HydratedSignupNameForm initialNickname={savedNickname} />;
}

function HydratedSignupNameForm({ initialNickname }: { initialNickname: string }): JSX.Element {
  const router = useRouter();
  const setStoredNickname = useSignupDraftStore((state) => state.setNickname);
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<SignupNameInput, unknown, SignupNameOutput>({
    defaultValues: { nickname: initialNickname },
    mode: 'onBlur',
    resolver: zodResolver(signupNameSchema),
  });
  const nickname = watch('nickname');

  const submit = handleSubmit(({ nickname: validatedNickname }) => {
    setStoredNickname(validatedNickname);
    router.push('/signup/company');
  });

  return (
    <AuthForm
      actions={
        <SignupStepActions
          onPrevious={() => router.push('/signup/password')}
          nextDisabled={nickname.trim().length === 0}
        />
      }
      title="이름 입력하기"
      titleId="signup-name-title"
      onSubmit={submit}
    >
      <InputField
        type="text"
        autoComplete="name"
        aria-label="이름"
        placeholder="이름을 입력해 주세요"
        feedback={
          errors.nickname
            ? {
                tone: 'error',
                message: errors.nickname.message,
              }
            : undefined
        }
        {...register('nickname')}
      />
    </AuthForm>
  );
}
