'use client';

import { useState, type FormEventHandler, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import {
  SignupStepActions,
  useSignupDraftStore,
  useSignupStepGuard,
  type SignupOccupation,
} from '@/features/auth/signup-flow';
import { AuthForm } from '@/features/auth/auth-form';
import { Dropdown, type DropdownOption } from '@/shared/ui/dropdown';
import { signupOccupationSchema } from '@/pages/auth/signup-occupation/model/signup-occupation-schema';

const OCCUPATION_OPTIONS = [
  { value: 'DEVELOPMENT', label: '개발' },
  { value: 'DESIGN', label: '디자인' },
  { value: 'MARKETING', label: '마케팅' },
  { value: 'PLANNING', label: '기획' },
  { value: 'SALES', label: '영업' },
  { value: 'DATA', label: '데이터' },
  { value: 'MANAGEMENT', label: '인사' },
  { value: 'ETC', label: '기타' },
] satisfies readonly DropdownOption<SignupOccupation>[];

export function SignupOccupationForm(): JSX.Element | null {
  const canAccessStep = useSignupStepGuard('occupation');
  const savedOccupation = useSignupDraftStore((state) => state.occupation);

  if (!canAccessStep) {
    return null;
  }

  return <ReadySignupOccupationForm initialOccupation={savedOccupation} />;
}

function ReadySignupOccupationForm({
  initialOccupation,
}: {
  initialOccupation?: SignupOccupation;
}): JSX.Element {
  const router = useRouter();
  const setStoredOccupation = useSignupDraftStore((state) => state.setOccupation);
  const [occupation, setOccupation] = useState<SignupOccupation | null>(initialOccupation ?? null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const result = signupOccupationSchema.safeParse({ occupation });

    if (!result.success) {
      return;
    }

    setStoredOccupation(result.data.occupation);
    router.push('/signup/terms');
  };

  return (
    <AuthForm
      actions={
        <SignupStepActions
          onPrevious={() => router.push('/signup/company')}
          nextDisabled={!occupation}
        />
      }
      title="직무 선택하기"
      titleId="signup-occupation-title"
      onSubmit={handleSubmit}
    >
      <Dropdown
        options={OCCUPATION_OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
        value={occupation}
        onValueChange={setOccupation}
      />
    </AuthForm>
  );
}
