'use client';

import type { JSX } from 'react';
import { X } from 'lucide-react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { ChannelDetailContent } from '@/features/channel-detail/ui/channel-detail-content';
import { ChannelDetailHeader } from '@/features/channel-detail/ui/channel-detail-header';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

export type ChannelDetailModalProps = {
  channel: ChannelDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit?: () => void;
};

/**
 * Figma 채널 상세 모달 박스 모델
 * - width: 840
 * - padding: spacing/030
 * - header ↔ tabs 간격: spacing/020
 * - height: hug (viewport 초과 시만 스크롤)
 */
export function ChannelDetailModal({
  channel,
  open,
  onOpenChange,
  onExit,
}: ChannelDetailModalProps): JSX.Element {
  return (
    <Modal.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          onExit?.();
        }
      }}
    >
      <Modal.Portal>
        <Modal.Backdrop />
        <Modal.Popup className="max-h-[90dvh] w-[840px] max-w-[calc(100vw-32px)] gap-0 overflow-y-auto p-0">
          <Stack className="gap-020 p-030 w-full shrink-0 items-stretch">
            <HStack className="gap-012 w-full items-start justify-between">
              <Box className="min-w-0 flex-1">
                <ChannelDetailHeader
                  channel={channel}
                  title={
                    <Modal.Title
                      render={
                        <Text as="h2" variant="display-lg" className="text-text-high truncate" />
                      }
                      className="m-0 text-left"
                    >
                      {channel.name}
                    </Modal.Title>
                  }
                  description={
                    <Modal.Description
                      render={<Text as="p" variant="subtitle-xxs" className="line-clamp-2" />}
                      className="text-text-low m-0 text-left"
                    >
                      {channel.tagline}
                    </Modal.Description>
                  }
                />
              </Box>
              <Modal.Close
                aria-label="닫기"
                className={[
                  'inline-flex size-032 shrink-0 items-center justify-center rounded-[var(--radius-s)]',
                  'text-icon-high transition-colors hover:not-data-disabled:text-icon-higher',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
                ].join(' ')}
              >
                <X className="size-020" aria-hidden />
              </Modal.Close>
            </HStack>

            <ChannelDetailContent channel={channel} />
          </Stack>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
