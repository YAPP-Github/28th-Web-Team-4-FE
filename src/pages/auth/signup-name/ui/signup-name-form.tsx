'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { SignupStepActions, useSignupDraftStore } from '@/features/auth/signup-flow';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol } from '@/shared/ui/symbol';
import { signupNameSchema } from '@/pages/auth/signup-name/model/signup-name-schema';

export function SignupNameForm(): JSX.Element | null {
  const router = useRouter();
  const email = useSignupDraftStore((state) => state.email);
  const emailVerified = useSignupDraftStore((state) => state.emailVerified);
  const password = useSignupDraftStore((state) => state.password);
  const savedNickname = useSignupDraftStore((state) => state.nickname);
  const hasHydrated = useSignupDraftStore((state) => state.hasHydrated);

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
    }
  }, [email, emailVerified, hasHydrated, password, router]);

  if (!hasHydrated || !email || !emailVerified || !password) {
    return null;
  }

  return <HydratedSignupNameForm initialNickname={savedNickname} />;
}

function HydratedSignupNameForm({ initialNickname }: { initialNickname: string }): JSX.Element {
  const router = useRouter();
  const setStoredNickname = useSignupDraftStore((state) => state.setNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [feedback, setFeedback] = useState<InputFieldFeedback>();
  const [isTouched, setIsTouched] = useState(false);

  const validateNickname = (value = nickname) => {
    const result = signupNameSchema.safeParse({ nickname: value });
    setFeedback(
      result.success ? undefined : { tone: 'error', message: result.error.issues[0]?.message },
    );

    return result;
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextNickname = event.currentTarget.value;
    setNickname(nextNickname);

    if (isTouched || feedback) {
      validateNickname(nextNickname);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTouched(true);

    const result = validateNickname();

    if (!result.success) {
      return;
    }

    setStoredNickname(result.data.nickname);
    router.push('/signup/company');
  };

  return (
    <>
      <FormPanelHeader
        graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
        title="이름 입력하기"
        titleId="signup-name-title"
      />

      <VStack as="form" className="gap-036 w-full items-stretch" noValidate onSubmit={handleSubmit}>
        <InputField
          name="nickname"
          type="text"
          autoComplete="name"
          aria-label="이름"
          placeholder="이름을 입력해 주세요"
          value={nickname}
          onChange={handleNicknameChange}
          onBlur={() => {
            setIsTouched(true);
            validateNickname();
          }}
          feedback={feedback}
        />

        <SignupStepActions
          onPrevious={() => router.push('/signup/password')}
          nextDisabled={nickname.trim().length === 0}
        />
      </VStack>
    </>
  );
}
