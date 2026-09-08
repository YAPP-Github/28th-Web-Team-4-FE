import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Box } from '@/shared/ui/layout/box';
import { Grid } from '@/shared/ui/layout/grid';

const meta = {
  title: 'components/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Grid {...args} className="grid-cols-2 gap-2 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Box key={index} className="bg-surface-high h-20" />
      ))}
    </Grid>
  ),
};

export const SemanticList: Story = {
  render: (args) => (
    <Grid {...args} as="ul" className="grid-cols-2 gap-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Box as="li" key={index} className="bg-surface-high h-20" />
      ))}
    </Grid>
  ),
};
