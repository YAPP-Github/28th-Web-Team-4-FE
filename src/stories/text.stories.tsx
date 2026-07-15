import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Text, TEXT_VARIANTS } from '@/shared/ui/text';

const SAMPLE = 'YAPP님께 딱 맞는 광고 채널을 추천해 드려요';

const meta = {
  title: 'components/Text',
  component: Text,
  args: {
    children: SAMPLE,
    variant: 'body-lg',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// 타이포 카탈로그 — 시각 차이는 Chromatic/육안, 클래스 매핑 단언은 하지 않음
export const AllVariants: Story = {
  render: () => (
    <div className="text-text-highest flex flex-col gap-6">
      {TEXT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="typo-caption-sm text-text-medium">{variant}</span>
          <Text variant={variant}>{SAMPLE}</Text>
        </div>
      ))}
    </div>
  ),
};

export const SingleVariant: Story = {
  args: {
    variant: 'heading-xl',
    children: SAMPLE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(SAMPLE)).toBeVisible();
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};

// className 문서는 Chromatic/문서용 — 스타일 클래스 단언 없음
export const CustomClassName: Story = {
  args: {
    variant: 'body-lg',
    className: 'text-text-primary',
    children: SAMPLE,
  },
};

export const AsHeading: Story = {
  args: {
    variant: 'display-lg',
    as: 'h1',
    children: SAMPLE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 1, name: SAMPLE })).toBeVisible();
  },
};
