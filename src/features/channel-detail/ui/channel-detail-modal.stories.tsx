import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
  CHANNEL_DETAIL_EMPTY_PRODUCTS_FIXTURE,
  CHANNEL_DETAIL_FIXTURE,
} from '@/features/channel-detail/model/channel-detail-fixture';
import { openResolvedChannelDetailModal } from '@/features/channel-detail/model/open-resolved-channel-detail-modal';
import { ChannelDetailContent } from '@/features/channel-detail/ui/channel-detail-content';
import { ChannelDetailContentSkeleton } from '@/features/channel-detail/ui/channel-detail-content-skeleton';
import { Button } from '@/shared/ui/button';

import { ChannelDetailModal } from './channel-detail-modal';

const CHANNEL_HEADER = {
  id: CHANNEL_DETAIL_FIXTURE.id,
  name: CHANNEL_DETAIL_FIXTURE.name,
  logoUrl: CHANNEL_DETAIL_FIXTURE.logoUrl,
  description: CHANNEL_DETAIL_FIXTURE.tagline,
} as const;

const meta = {
  title: 'features/channel-detail/ChannelDetailModal',
  component: ChannelDetailModal,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface-high flex min-h-80 w-full items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChannelDetailModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    channel: CHANNEL_HEADER,
    children: <ChannelDetailContent channel={CHANNEL_DETAIL_FIXTURE} />,
    open: true,
    onOpenChange: () => undefined,
  },
};

export const Loading: Story = {
  args: {
    channel: CHANNEL_HEADER,
    children: <ChannelDetailContentSkeleton />,
    open: true,
    onOpenChange: () => undefined,
  },
};

export const EmptyProducts: Story = {
  args: {
    channel: CHANNEL_HEADER,
    children: <ChannelDetailContent channel={CHANNEL_DETAIL_EMPTY_PRODUCTS_FIXTURE} />,
    open: true,
    onOpenChange: () => undefined,
  },
  play: async () => {
    const body = within(document.body);
    await expect(body.getByRole('dialog', { name: '메타 광고' })).toBeVisible();
    await userEvent.click(body.getByRole('tab', { name: '광고 상품' }));
    // 탭 패널 높이·슬라이드 애니가 끝난 뒤 visible 상태가 된다
    await waitFor(async () => {
      await expect(body.getByText('등록된 광고 상품이 없습니다.')).toBeVisible();
    });
  },
};

export const OpenWithOverlayKit: Story = {
  args: {
    channel: CHANNEL_HEADER,
    children: <ChannelDetailContent channel={CHANNEL_DETAIL_FIXTURE} />,
    open: false,
    onOpenChange: () => undefined,
  },
  render: () => (
    <Button
      frame="button"
      tone="secondary"
      size="m"
      onClick={() => {
        openResolvedChannelDetailModal(CHANNEL_DETAIL_FIXTURE);
      }}
    >
      상세보기
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: '상세보기' }));
    // overlay.open → Portal mount + 진입 애니가 끝난 뒤 visible 상태가 된다
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: '메타 광고' })).toBeVisible();
    });

    await userEvent.click(body.getByRole('button', { name: '닫기' }));
    await waitFor(async () => {
      await expect(body.queryByRole('dialog', { name: '메타 광고' })).not.toBeInTheDocument();
    });
  },
};
