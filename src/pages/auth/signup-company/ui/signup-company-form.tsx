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
import { signupCompanySchema } from '@/pages/auth/signup-company/model/signup-company-schema';

type SignupCompanyInput = z.input<typeof signupCompanySchema>;
type SignupCompanyOutput = z.output<typeof signupCompanySchema>;

export function SignupCompanyForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('company');
  const savedCompanyName = useSignupDraftStore((state) => state.companyName);

  if (!canAccessStep) {
    return null;
  }

  return <HydratedSignupCompanyForm initialCompanyName={savedCompanyName} />;
}

function HydratedSignupCompanyForm({
  initialCompanyName,
}: {
  initialCompanyName: string;
}): JSX.Element {
  const router = useRouter();
  const setStoredCompanyName = useSignupDraftStore((state) => state.setCompanyName);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignupCompanyInput, unknown, SignupCompanyOutput>({
    defaultValues: { companyName: initialCompanyName },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(signupCompanySchema),
  });

  const submit = handleSubmit(({ companyName }) => {
    setStoredCompanyName(companyName);
    router.push('/signup/occupation');
  });

  return (
    <AuthForm
      actions={<SignupStepActions onPrevious={() => router.push('/signup/name')} />}
      title="회사명 입력하기"
      titleId="signup-company-title"
      onSubmit={submit}
    >
      <InputField
        type="text"
        autoComplete="organization"
        aria-label="회사명"
        placeholder="회사명을 입력해 주세요"
        feedback={
          errors.companyName
            ? {
                tone: 'error',
                message: errors.companyName.message,
              }
            : undefined
        }
        {...register('companyName')}
      />
    </AuthForm>
  );
}
