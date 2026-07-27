/**
 * OnboardingQuestion의 기본·설명·구조화 콘텐츠 상태를 검증한다.
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { OnboardingQuestion } from '@/features/recommend-onboarding/ui/onboarding-question';
import { SelectCard } from '@/features/recommend-onboarding/ui/select-card';
import { StepActionButton } from '@/features/recommend-onboarding/ui/step-action-button';
import { RadioGroup } from '@/shared/ui/radio-group';

const meta = {
  title: 'features/RecommendOnboarding/OnboardingQuestion',
  component: OnboardingQuestion,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[510px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardingQuestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {
    title: '서비스 이름을 알려 주세요',
  },
};

export const WithDescription: Story = {
  args: {
    title: '어떤 연령층을 타깃으로 광고를 진행할까요?',
    description: '중복 선택이 가능해요',
  },
};

export const WithControls: Story = {
  args: {
    title: '서비스 형태가 무엇인가요?',
  },
  render: (args) => (
    <OnboardingQuestion {...args} className="max-w-[410px]">
      <div className="gap-020 flex w-full flex-col">
        <RadioGroup aria-label="서비스 형태" className="gap-010">
          <SelectCard
            control="radio"
            value="MOBILE_APP"
            label="모바일 앱"
            description="iOS / Android"
          />
          <SelectCard control="radio" value="OTHER" label="기타" />
        </RadioGroup>
        <StepActionButton disabled>다음</StepActionButton>
      </div>
    </OnboardingQuestion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: '서비스 형태가 무엇인가요?' })).toBeVisible();
    await expect(canvas.getByRole('radio', { name: /모바일 앱/ })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeDisabled();
  },
};
