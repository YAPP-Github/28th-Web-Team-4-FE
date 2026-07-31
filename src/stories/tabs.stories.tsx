import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '@/shared/ui/layout/box';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

function UnderlineTabsExample() {
  return (
    <Tabs.Root defaultValue="summary" className="w-full max-w-[560px]">
      <Tabs.List>
        <Tabs.Tab value="summary">핵심 요약</Tabs.Tab>
        <Tabs.Tab value="products">광고 상품</Tabs.Tab>
        <Tabs.Tab value="audience">타깃층</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <div className="pt-020">
        <Tabs.Panel value="summary">
          <Text as="p" variant="body-md" className="text-text-medium">
            핵심 요약 패널 내용입니다.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="products">
          <Text as="p" variant="body-md" className="text-text-medium">
            광고 상품 패널 내용입니다.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="audience">
          <Text as="p" variant="body-md" className="text-text-medium">
            타깃층 패널 내용입니다.
          </Text>
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  );
}

const meta = {
  title: 'components/Tabs',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box className="bg-surface-background-low rounded-m flex min-h-56 w-full items-center justify-center p-6">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <UnderlineTabsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('tab', { name: '핵심 요약' })).toHaveAttribute('data-active');
    await expect(canvas.getByText('핵심 요약 패널 내용입니다.')).toBeVisible();

    await userEvent.click(canvas.getByRole('tab', { name: '광고 상품' }));
    await expect(canvas.getByRole('tab', { name: '광고 상품' })).toHaveAttribute('data-active');
    await expect(canvas.getByText('광고 상품 패널 내용입니다.')).toBeVisible();
  },
};
