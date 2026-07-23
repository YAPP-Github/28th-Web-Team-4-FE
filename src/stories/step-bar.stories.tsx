import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { StepBar } from '@/shared/ui/step-bar';
import { Text } from '@/shared/ui/text';

const ONBOARDING_LABELS = [0, 12, 25, 37, 50, 62, 75, 87, 100];
const BUDGET_LABELS = [0, 35, 70, 100];
const SIMULATOR_LABELS = [0, 20, 40, 60, 80, 100];

const meta = {
  title: 'components/StepBar',
  component: StepBar,
  tags: ['autodocs'],
  args: {
    currentStep: 3,
    totalSteps: 8,
    labels: ONBOARDING_LABELS,
  },
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    totalSteps: { control: false },
    labels: { control: false },
    showLabel: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-low rounded-m flex min-h-56 w-full items-center justify-center p-6">
        <Box className="w-full max-w-[792px]">
          <Story />
        </Box>
      </Box>
    ),
  ],
} satisfies Meta<typeof StepBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progressBar = canvas.getByRole('progressbar', { name: '진행률' });

    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuetext', '37%');
  },
};

export const AllSteps: Story = {
  argTypes: {
    currentStep: { control: false },
    totalSteps: { control: false },
    labels: { control: false },
    showLabel: { control: false },
    ariaLabel: { control: false },
    className: { control: false },
  },
  render: () => (
    <Box className="flex w-full flex-col gap-6">
      {ONBOARDING_LABELS.map((label, step) => (
        <Box key={label} className="flex flex-col gap-2">
          <Text variant="caption-sm" className="text-text-medium">
            {step}단계
          </Text>
          <StepBar currentStep={step} totalSteps={8} labels={ONBOARDING_LABELS} />
        </Box>
      ))}
    </Box>
  ),
};

export const CustomLabels: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    labels: BUDGET_LABELS,
    ariaLabel: '예산 시뮬레이터 진행률',
  },
  argTypes: {
    currentStep: { control: { type: 'number', min: 0, max: 3, step: 1 } },
  },
};

export const WithoutLabel: Story = {
  args: {
    currentStep: 5,
    totalSteps: 8,
    labels: ONBOARDING_LABELS,
    showLabel: false,
  },
};

export const SimulatorSubHeader: Story = {
  argTypes: {
    currentStep: { control: false },
    totalSteps: { control: false },
    labels: { control: false },
    showLabel: { control: false },
    ariaLabel: { control: false },
    className: { control: false },
  },
  render: () => (
    <Box className="bg-surface-lowest border-outline-low flex w-full justify-center border-y">
      <Box className="py-018 gap-006 flex w-full max-w-[792px] flex-col items-center justify-center">
        <Box className="gap-012 flex w-full items-center justify-center">
          <Badge frame="badge" tone="primary" className="w-[22px]">
            1
          </Badge>
          <Text variant="heading-lg" className="text-text-highest min-w-0 flex-1">
            서비스 이름
          </Text>
        </Box>
        <StepBar
          currentStep={0}
          totalSteps={5}
          labels={SIMULATOR_LABELS}
          ariaLabel="예산 시뮬레이터 진행률"
        />
      </Box>
    </Box>
  ),
};
