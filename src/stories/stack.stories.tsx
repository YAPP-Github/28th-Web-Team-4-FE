import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { HStack as HStackComponent } from '@/shared/ui/layout/h-stack';
import { VStack as VStackComponent } from '@/shared/ui/layout/v-stack';

const meta = {
  title: 'components/Stack',
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Stack {...args} className="gap-2">
      <Box className="h-20 bg-gray-200" />
      <Box className="h-20 bg-gray-200" />
      <Box className="h-20 bg-gray-200" />
    </Stack>
  ),
};

export const HStack: Story = {
  render: (args) => (
    <HStackComponent {...args} className="gap-2">
      <Box className="h-10 w-full bg-gray-200" />
      <Box className="h-5 w-full bg-gray-200" />
      <Box className="h-20 w-full bg-gray-200" />
    </HStackComponent>
  ),
};

export const VStack: Story = {
  render: (args) => (
    <VStackComponent {...args} className="gap-2">
      <Box className="h-20 w-1/2 bg-gray-200" />
      <Box className="h-20 w-1/3 bg-gray-200" />
      <Box className="h-20 w-full bg-gray-200" />
    </VStackComponent>
  ),
};
