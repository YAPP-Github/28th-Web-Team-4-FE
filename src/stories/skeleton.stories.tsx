import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';

const meta = {
  title: 'components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    className: 'h-016 w-[240px]',
  },
  argTypes: {
    className: { control: 'text' },
    children: { control: false },
    style: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lowest rounded-m flex min-h-56 w-full items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '크기와 모서리는 className으로 조합합니다. 개별 Skeleton은 장식 요소이므로, 로딩 안내는 상위 role="status"에서 한 번만 제공합니다. 반복 애니메이션은 reduced motion 환경에서 정지합니다.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoxShape: Story = {};

export const RoundedBox: Story = {
  args: {
    className: 'h-016 w-[240px] rounded-[var(--radius-xs)]',
  },
};

export const Circle: Story = {
  args: {
    className: 'size-040 rounded-full',
  },
};

export const Composition: Story = {
  argTypes: {
    className: { control: false },
  },
  render: () => (
    <Box role="status" className="border-outline-low rounded-m w-full max-w-[320px] border p-6">
      <span className="sr-only">콘텐츠를 불러오는 중이에요</span>
      <Stack className="gap-020">
        <HStack className="gap-012 items-center">
          <Skeleton className="size-040 shrink-0 rounded-full" />
          <Stack className="gap-008 min-w-0 flex-1">
            <Skeleton className="h-016 w-1/2 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-014 w-4/5 rounded-[var(--radius-xs)]" />
          </Stack>
        </HStack>
        <Stack className="gap-008">
          <Skeleton className="h-014 w-full rounded-[var(--radius-xs)]" />
          <Skeleton className="h-014 w-11/12 rounded-[var(--radius-xs)]" />
          <Skeleton className="h-014 w-3/5 rounded-[var(--radius-xs)]" />
        </Stack>
      </Stack>
    </Box>
  ),
};
