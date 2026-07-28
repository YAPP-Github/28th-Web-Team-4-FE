'use client';

import { useEffect, useState, type ChangeEvent, type FormEventHandler, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { SignupStepActions, useSignupDraftStore } from '@/features/auth/signup-flow';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol } from '@/shared/ui/symbol';
import { signupCompanySchema } from '@/pages/auth/signup-company/model/signup-company-schema';

export function SignupCompanyForm(): JSX.Element | null {
  const router = useRouter();
  const {
    email,
    emailVerified,
    password,
    nickname,
    companyName: savedCompanyName,
    hasHydrated,
  } = useSignupDraftStore(
    useShallow((state) => ({
      email: state.email,
      emailVerified: state.emailVerified,
      password: state.password,
      nickname: state.nickname,
      companyName: state.companyName,
      hasHydrated: state.hasHydrated,
    })),
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!email || !emailVerified) {
      router.replace('/login');
      return;
    }

    if (!password) {
      router.replace('/signup/password');
      return;
    }

    if (!nickname) {
      router.replace('/signup/name');
    }
  }, [email, emailVerified, hasHydrated, nickname, password, router]);

  if (!hasHydrated || !email || !emailVerified || !password || !nickname) {
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
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [feedback, setFeedback] = useState<InputFieldFeedback>();
  const [isTouched, setIsTouched] = useState(false);

  const validateCompanyName = (value = companyName) =>
    signupCompanySchema.safeParse({ companyName: value });

  const updateCompanyNameFeedback = (result: ReturnType<typeof validateCompanyName>) => {
    setFeedback(
      result.success ? undefined : { tone: 'error', message: result.error.issues[0]?.message },
    );
  };

  const handleCompanyNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCompanyName = event.currentTarget.value;
    setCompanyName(nextCompanyName);

    if (isTouched || feedback) {
      updateCompanyNameFeedback(validateCompanyName(nextCompanyName));
    }
  };

  const handleCompanyNameBlur = () => {
    setIsTouched(true);
    updateCompanyNameFeedback(validateCompanyName());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsTouched(true);

    const result = validateCompanyName();
    updateCompanyNameFeedback(result);

    if (!result.success) {
      return;
    }

    setStoredCompanyName(result.data.companyName);
    router.push('/signup/occupation');
  };

  return (
    <>
      <FormPanelHeader
        graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
        title="회사명 입력하기"
        titleId="signup-company-title"
      />

      <VStack as="form" className="gap-036 w-full items-stretch" noValidate onSubmit={handleSubmit}>
        <InputField
          name="companyName"
          type="text"
          autoComplete="organization"
          aria-label="회사명"
          placeholder="회사명을 입력해 주세요"
          value={companyName}
          onChange={handleCompanyNameChange}
          onBlur={handleCompanyNameBlur}
          feedback={feedback}
        />

        <SignupStepActions onPrevious={() => router.push('/signup/name')} />
      </VStack>
    </>
  );
}
