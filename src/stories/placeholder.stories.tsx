import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Placeholder } from '@/shared/ui/placeholder';

const meta = {
  title: 'components/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  args: {
    title: '비교할 광고 채널이 없어요',
    subtitle: '광고 조건을 먼저 입력해 주세요',
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    graphic: { control: false },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-background-low rounded-m flex min-h-80 w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('비교할 광고 채널이 없어요')).toBeVisible();
    await expect(canvas.getByText('광고 조건을 먼저 입력해 주세요')).toBeVisible();
  },
};

export const Loading: Story = {
  args: {
    title: '나에게 딱 맞는 채널을 찾는 중...',
    subtitle: '잠시만 기다려 주세요',
  },
};

export const CustomGraphic: Story = {
  args: {
    title: '그래픽을 교체할 수 있어요',
    subtitle: '아이콘이나 이미지 컴포넌트를 슬롯으로 전달해 주세요',
    graphic: (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-icon-high size-full"
        aria-hidden
      >
        <rect x="18" y="18" width="84" height="84" rx="24" className="fill-surface-lower" />
        <path
          d="M38 61.5L52.5 76L84 44"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'opacity-80',
  },
};
