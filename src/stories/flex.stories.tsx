import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Flex } from '@/shared/ui/layout/flex';

import { Box } from '@/shared/ui/layout/box';
import { JustifyBetween as JustifyBetweenComponent } from '@/shared/ui/layout/justify-between';
import { JustifyEnd as JustifyEndComponent } from '@/shared/ui/layout/justify-end';

const meta = {
  title: 'components/Flex',
  tags: ['autodocs'],
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Flex {...args} className="gap-2">
      <Box className="h-20 w-1/6 bg-gray-200" />
      <Box className="h-30 w-1/6 bg-gray-200" />
      <Box className="h-10 w-1/6 bg-gray-200" />
    </Flex>
  ),
};

export const JustifyBetween: Story = {
  render: (args) => (
    <JustifyBetweenComponent {...args} className="gap-2">
      <Box className="h-10 w-1/6 bg-gray-200" />
      <Box className="h-10 w-1/4 bg-gray-200" />
    </JustifyBetweenComponent>
  ),
};

export const JustifyEnd: Story = {
  render: (args) => (
    <JustifyEndComponent {...args} className="gap-2 bg-gray-400">
      <Box className="h-20 w-1/6 bg-gray-200" />
    </JustifyEndComponent>
  ),
};
