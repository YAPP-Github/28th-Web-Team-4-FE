/**
 * 8개 온보딩 질문의 React Hook Form 연결과 단계별 상호작용을 검증한다.
 */

import type { JSX, PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { useOnboardingForm } from '@/features/recommend-onboarding/model/use-onboarding-form';
import { OnboardingStepContent } from '@/features/recommend-onboarding/ui/onboarding-step-content';

const meta = {
  title: 'features/RecommendOnboarding/OnboardingStepContent',
  component: OnboardingStepContent,
  tags: ['autodocs'],
  args: {
    stepId: 'service-name',
    onAction: fn(),
  },
  decorators: [
    (Story) => (
      <OnboardingStoryForm>
        <div className="w-full max-w-[510px]">
          <Story />
        </div>
      </OnboardingStoryForm>
    ),
  ],
} satisfies Meta<typeof OnboardingStepContent>;

export default meta;
type Story = StoryObj<typeof meta>;

type OnboardingStoryFormProps = PropsWithChildren;

/** 각 story가 독립적인 온보딩 draft를 사용하도록 폼 컨텍스트를 제공한다. */
function OnboardingStoryForm({ children }: OnboardingStoryFormProps): JSX.Element {
  const form = useOnboardingForm();

  return <FormProvider {...form}>{children}</FormProvider>;
}

export const ServiceName: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: '서비스 이름' });
    const actionButton = canvas.getByRole('button', { name: '다음' });

    await expect(actionButton).toBeDisabled();
    await userEvent.type(input, '채소집');
    await expect(actionButton).toBeEnabled();
    await userEvent.click(actionButton);
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
};

export const Category: Story = {
  args: {
    stepId: 'category',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole('radio', { name: '금융·핀테크' });
    const actionButton = canvas.getByRole('button', { name: '다음' });

    await expect(actionButton).toBeDisabled();
    await userEvent.click(canvas.getByText('금융·핀테크'));
    await expect(option).toBeChecked();
    await expect(actionButton).toBeEnabled();
  },
};

export const ServiceType: Story = {
  args: {
    stepId: 'service-type',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole('radio', { name: /웹 서비스/ });

    await expect(canvas.getByText('PC·모바일 브라우저')).toBeVisible();
    await userEvent.click(canvas.getByText('웹 서비스'));
    await expect(option).toBeChecked();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const AgeRanges: Story = {
  args: {
    stepId: 'age-ranges',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const twenties = canvas.getByRole('checkbox', { name: '20대' });
    const unknown = canvas.getByRole('checkbox', { name: '잘 모르겠어요' });
    const teens = canvas.getByRole('checkbox', { name: '10대' });

    await userEvent.click(canvas.getByText('20대'));
    await expect(twenties).toBeChecked();
    await expect(unknown).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(canvas.getByText('20대'));
    await userEvent.click(canvas.getByText('잘 모르겠어요'));
    await expect(unknown).toBeChecked();
    await expect(teens).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const AdGoal: Story = {
  args: {
    stepId: 'ad-goal',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const option = canvas.getByRole('radio', { name: '구매·결제 전환' });

    await expect(canvas.getByRole('heading', { name: '더 많은 사람에게 알리기' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: '고객의 행동 유도하기' })).toBeVisible();
    await userEvent.click(canvas.getByText('구매·결제 전환'));
    await expect(option).toBeChecked();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const Budget: Story = {
  args: {
    stepId: 'budget',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const customBudget = canvas.getByRole('radio', { name: '직접 입력' });

    await userEvent.click(canvas.getByText('직접 입력'));
    await expect(customBudget).toBeChecked();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const CampaignPeriod: Story = {
  args: {
    stepId: 'campaign-period',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('1주 이하'));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '일부 채널(메타·구글 등)은 최소 7일 이상 집행을 권장해요',
    );
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};

export const AdExperience: Story = {
  args: {
    stepId: 'ad-experience',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const experienced = canvas.getByRole('radio', { name: '광고를 운영해 봤어요' });

    await userEvent.click(canvas.getByText('광고를 운영해 봤어요'));
    await expect(experienced).toBeChecked();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};
