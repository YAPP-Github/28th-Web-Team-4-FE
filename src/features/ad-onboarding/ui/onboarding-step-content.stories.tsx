/**
 * 8개 온보딩 질문의 React Hook Form 연결과 단계별 상호작용을 검증한다.
 */

import type { JSX, PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import {
  INITIAL_ONBOARDING_DRAFT,
  type OnboardingDraft,
} from '@/features/ad-onboarding/model/recommend-onboarding-state';
import { useOnboardingForm } from '@/features/ad-onboarding/model/use-onboarding-form';
import { OnboardingStepContent } from '@/features/ad-onboarding/ui/onboarding-step-content';

const ONBOARDING_DRAFT_PARAMETER_KEY = 'onboardingDraft';
const EMPTY_BUDGET_DRAFT = {
  ...INITIAL_ONBOARDING_DRAFT,
  budget: {
    minAmount: 0,
    maxAmount: 0,
  },
  budgetInputRange: {
    minInputValue: 0,
    maxInputValue: 0,
  },
} satisfies OnboardingDraft;

const meta = {
  title: 'features/AdOnboarding/OnboardingStepContent',
  component: OnboardingStepContent,
  tags: ['autodocs'],
  args: {
    stepId: 'service-name',
    onAction: fn(),
  },
  decorators: [
    (Story, context) => (
      <OnboardingStoryForm
        initialDraft={
          context.parameters[ONBOARDING_DRAFT_PARAMETER_KEY] as OnboardingDraft | undefined
        }
      >
        <div className="w-full max-w-[518px]">
          <Story />
        </div>
      </OnboardingStoryForm>
    ),
  ],
} satisfies Meta<typeof OnboardingStepContent>;

export default meta;
type Story = StoryObj<typeof meta>;

type OnboardingStoryFormProps = PropsWithChildren<{
  initialDraft?: OnboardingDraft;
}>;

/** 각 story가 독립적인 온보딩 draft를 사용하도록 폼 컨텍스트를 제공한다. */
function OnboardingStoryForm({ children, initialDraft }: OnboardingStoryFormProps): JSX.Element {
  const form = useOnboardingForm({ initialDraft });

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
};

export const BudgetError: Story = {
  args: {
    stepId: 'budget',
  },
  parameters: {
    [ONBOARDING_DRAFT_PARAMETER_KEY]: EMPTY_BUDGET_DRAFT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('alert')).toHaveTextContent('예산을 입력해 주세요');
    await expect(canvas.getByRole('button', { name: '다음' })).toBeDisabled();
  },
};

export const BudgetInteraction: Story = {
  tags: ['!dev'],
  args: {
    stepId: 'budget',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const actionButton = canvas.getByRole('button', { name: '다음' });
    await expect(actionButton).toBeEnabled();

    const minBudgetInput = canvas.getByRole('spinbutton', { name: '최소 예산' });
    const maxBudgetInput = canvas.getByRole('spinbutton', { name: '최대 예산' });
    const minBudgetSlider = canvas.getByRole('slider', { name: '최소 예산 슬라이더' });
    const maxBudgetSlider = canvas.getByRole('slider', { name: '최대 예산 슬라이더' });

    await expect(minBudgetInput).toHaveValue(0);
    await expect(maxBudgetInput).toHaveValue(1000);
    await expect(minBudgetSlider).toHaveValue('0');
    await expect(maxBudgetSlider).toHaveValue('4');

    await userEvent.clear(minBudgetInput);
    await userEvent.type(minBudgetInput, '35.5');
    await expect(minBudgetInput).toHaveValue(35.5);
    await expect(minBudgetSlider).toHaveValue('0');

    await userEvent.keyboard('{Enter}');
    await expect(minBudgetInput).toHaveValue(50);
    await expect(minBudgetSlider).toHaveValue('1');
    await expect(args.onAction).not.toHaveBeenCalled();

    await userEvent.clear(maxBudgetInput);
    await userEvent.type(maxBudgetInput, '300');
    await expect(maxBudgetInput).toHaveValue(300);
    await expect(maxBudgetSlider).toHaveValue('4');

    await userEvent.tab();
    await expect(maxBudgetInput).toHaveValue(200);
    await expect(maxBudgetSlider).toHaveValue('2');

    await userEvent.clear(minBudgetInput);
    await userEvent.type(minBudgetInput, '500');
    await expect(minBudgetInput).toHaveValue(500);
    await expect(minBudgetSlider).toHaveValue('1');

    await userEvent.tab();
    await expect(minBudgetInput).toHaveValue(200);
    await expect(minBudgetSlider).toHaveValue('2');

    maxBudgetSlider.focus();
    await userEvent.keyboard('{End}');
    await expect(maxBudgetSlider).toHaveValue('4');
    await expect(maxBudgetInput).toHaveValue(1000);

    await userEvent.clear(minBudgetInput);
    await userEvent.tab();
    await expect(minBudgetInput).toHaveValue(0);
    await expect(minBudgetSlider).toHaveValue('0');

    await userEvent.clear(minBudgetInput);
    await userEvent.type(minBudgetInput, '200');
    await userEvent.tab();
    await expect(minBudgetInput).toHaveValue(200);
    await expect(minBudgetSlider).toHaveValue('2');

    await userEvent.clear(maxBudgetInput);
    await userEvent.tab();
    await expect(minBudgetInput).toHaveValue(0);
    await expect(maxBudgetInput).toHaveValue(0);
    await expect(minBudgetSlider).toHaveValue('0');
    await expect(maxBudgetSlider).toHaveValue('0');
    await expect(minBudgetInput).toHaveAttribute('aria-invalid', 'true');
    await expect(maxBudgetInput).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('예산을 입력해 주세요');
    await expect(actionButton).toBeDisabled();

    maxBudgetSlider.focus();
    await userEvent.keyboard('{End}');
    await expect(minBudgetInput).toHaveValue(0);
    await expect(maxBudgetInput).toHaveValue(1000);
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(actionButton).toBeEnabled();
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const firstTime = canvas.getByRole('radio', { name: '집행은 처음이에요' });

    await userEvent.click(canvas.getByText('집행은 처음이에요'));
    await expect(firstTime).toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: '다음' }));
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
};

export const AdExperienceDetails: Story = {
  tags: ['!dev'],
  args: {
    stepId: 'ad-experience',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByText('광고를 운영해 봤어요'));
    await userEvent.click(canvas.getByRole('button', { name: '다음' }));

    await expect(
      canvas.getByRole('heading', { name: '진행했던 광고 성과들을 알려 주세요' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: '건너뛰기' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeDisabled();

    const fileInput = canvas.getByLabelText('광고 성과 파일');
    const file = new File(['performance'], 'meta-performance.csv', {
      type: 'text/csv',
      lastModified: 1,
    });

    await userEvent.upload(fileInput, file);
    await expect(canvas.getByText('meta-performance.csv')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: 'meta-performance.csv 삭제' }));
    await expect(canvas.getByRole('button', { name: '다음' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('tab', { name: '직접 입력' }));
    const channelCombobox = canvas.getByRole('combobox', { name: '광고 채널' });
    await userEvent.click(channelCombobox);
    await userEvent.click(body.getByRole('option', { name: '메타 광고' }));

    await expect(channelCombobox).toHaveValue('메타 광고');
    await expect(canvas.getByRole('button', { name: '다음' })).toBeEnabled();
  },
};
