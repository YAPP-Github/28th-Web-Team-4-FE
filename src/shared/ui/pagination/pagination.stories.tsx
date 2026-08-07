import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';

import { Pagination, type PaginationProps } from './pagination';

const meta = {
  title: 'components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    onPageChange: { control: false },
  },
  decorators: [
    (Story) => (
      <Box className="bg-surface-lower flex min-h-[160px] w-full items-center justify-center p-10">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<PaginationProps>;

export default meta;
type Story = StoryObj<PaginationProps>;

function PaginationExample({ initialPage = 3 }: { initialPage?: number }): JSX.Element {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />;
}

export const Default: Story = {
  render: () => <PaginationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await expect(canvas.getByRole('button', { name: '페이지 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(canvas.getByRole('button', { name: '페이지 4' }));
    await expect(body.getByRole('button', { name: '페이지 4' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const FirstPage: Story = {
  render: () => <PaginationExample initialPage={1} />,
};

export const LastPage: Story = {
  render: () => <PaginationExample initialPage={5} />,
};
