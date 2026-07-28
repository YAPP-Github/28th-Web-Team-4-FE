'use client';

import { useState, type ChangeEvent, type FormEventHandler, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import {
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
} from '@/features/auth/signup-flow';
import { FormPanelHeader } from '@/shared/ui/form-panel';
import { InputField, type InputFieldFeedback } from '@/shared/ui/input-field';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol } from '@/shared/ui/symbol';
import { signupNameSchema } from '@/pages/auth/signup-name/model/signup-name-schema';

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
  const [nickname, setNickname] = useState(initialNickname);
  const [feedback, setFeedback] = useState<InputFieldFeedback>();
  const [isTouched, setIsTouched] = useState(false);

  const validateNickname = (value = nickname) => signupNameSchema.safeParse({ nickname: value });

  const updateNicknameFeedback = (result: ReturnType<typeof validateNickname>) => {
    setFeedback(
      result.success ? undefined : { tone: 'error', message: result.error.issues[0]?.message },
    );
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextNickname = event.currentTarget.value;
    setNickname(nextNickname);

    if (isTouched || feedback) {
      updateNicknameFeedback(validateNickname(nextNickname));
    }
  };

  const handleNicknameBlur = () => {
    setIsTouched(true);
    updateNicknameFeedback(validateNickname());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsTouched(true);

    const result = validateNickname();
    updateNicknameFeedback(result);

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
          onBlur={handleNicknameBlur}
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
