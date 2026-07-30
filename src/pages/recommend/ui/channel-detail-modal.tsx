'use client';

import type { JSX } from 'react';
import { X } from 'lucide-react';

import {
  ChannelDetailContent,
  ChannelDetailHeader,
} from '@/pages/recommend/ui/channel-detail-content';
import type { ChannelDetail } from '@/pages/recommend/model/channel-detail';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

export type ChannelDetailModalProps = {
  channel: ChannelDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit?: () => void;
};

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
        <Modal.Popup className="max-h-[min(90dvh,720px)] w-[640px] max-w-[calc(100vw-32px)] gap-0 overflow-hidden p-0">
          <Box className="px-030 pt-030 gap-012 flex shrink-0 items-start justify-between">
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
          </Box>
          <Box className="px-030 pt-020 pb-030 overflow-y-auto">
            <ChannelDetailContent channel={channel} />
          </Box>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
