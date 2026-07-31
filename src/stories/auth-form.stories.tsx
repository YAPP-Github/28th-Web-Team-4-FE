import { useState, type FormEventHandler } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AuthForm } from '@/features/auth/auth-form';
import {
  SignupAgreementFields,
  SignupStepActions,
  type SignupAgreements,
} from '@/features/auth/signup-flow';
import { Dropdown, type DropdownOption } from '@/shared/ui/dropdown';
import { InputField } from '@/shared/ui/input-field';
import { Box } from '@/shared/ui/layout/box';
import { VStack } from '@/shared/ui/layout/v-stack';

const OCCUPATION_OPTIONS = [
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'marketing', label: '마케팅' },
] satisfies readonly DropdownOption[];

const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault();
};

const defaultActions = <SignupStepActions onPrevious={fn()} />;

const meta = {
  title: 'features/auth/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  args: {
    actions: defaultActions,
    title: '이름 입력하기',
    titleId: 'signup-step-form-story-title',
    onSubmit: handleSubmit,
    children: <InputField aria-label="이름" placeholder="이름을 입력해 주세요" />,
  },
  argTypes: {
    actions: { control: false },
    children: { control: false },
    onSubmit: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lower flex min-h-[620px] w-full items-center justify-center p-8">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputFieldCase: Story = {
  name: '일반 인풋 필드',
};

export const PasswordCase: Story = {
  name: '비밀번호',
  args: {
    title: '비밀번호 설정하기',
    children: (
      <VStack className="gap-012 items-stretch">
        <InputField frame="password" aria-label="비밀번호" placeholder="비밀번호를 입력해 주세요" />
        <InputField
          frame="password"
          aria-label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해 주세요"
        />
      </VStack>
    ),
  },
};

export const DropdownCase: Story = {
  name: '드롭다운',
  args: {
    title: '직무 선택하기',
    children: (
      <Dropdown
        options={OCCUPATION_OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('combobox', { name: '직무' }));
    await userEvent.click(await body.findByRole('option', { name: '개발' }));
    await expect(canvas.getByRole('combobox', { name: '직무' })).toHaveTextContent('개발');
  },
};

function TermsAgreementExample() {
  const [agreements, setAgreements] = useState<SignupAgreements>({
    serviceTermsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
  });
  const { serviceTermsAgreed, privacyAgreed } = agreements;

  return (
    <AuthForm
      actions={
        <SignupStepActions
          onPrevious={fn()}
          nextDisabled={!serviceTermsAgreed || !privacyAgreed}
          nextLabel="가입하기"
        />
      }
      title="약관 동의하기"
      titleId="signup-step-form-story-title"
      onSubmit={handleSubmit}
    >
      <SignupAgreementFields
        agreements={agreements}
        idPrefix="story"
        onAgreementsChange={setAgreements}
      />
    </AuthForm>
  );
}

export const TermsAgreementCase: Story = {
  name: '약관 동의',
  render: () => <TermsAgreementExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const signupButton = canvas.getByRole('button', { name: '가입하기' });

    await expect(signupButton).toBeDisabled();
    await userEvent.click(canvas.getByRole('checkbox', { name: '전체 동의하기' }));
    await expect(signupButton).toBeEnabled();
  },
};
