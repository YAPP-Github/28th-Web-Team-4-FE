import type { JSX, ReactNode } from 'react';
import { X } from 'lucide-react';

import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';
import { ChannelDetailHeader } from '@/features/channel-detail/ui/channel-detail-header';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

export function ChannelDetailModalHeader({
  channel,
  description,
}: {
  channel: ChannelDetailHeaderData;
  description: ReactNode;
}): JSX.Element {
  const isTextDescription = typeof description === 'string';

  return (
    <HStack className="gap-012 w-full items-start justify-between">
      <Box className="min-w-0 flex-1">
        <ChannelDetailHeader
          channel={channel}
          title={
            <Modal.Title
              render={<Text as="h2" variant="display-lg" className="text-text-high truncate" />}
              className="m-0 text-left"
            >
              {channel.name}
            </Modal.Title>
          }
          description={
            <Modal.Description
              render={
                <Text
                  as="div"
                  variant="subtitle-xxs"
                  className={cn('min-h-044 w-full', isTextDescription ? 'line-clamp-2' : undefined)}
                />
              }
              className="text-text-low m-0 text-left"
            >
              {description}
            </Modal.Description>
          }
        />
      </Box>
      <Modal.Close
        aria-label="닫기"
        className={[
          'inline-flex size-032 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-s)]',
          'text-icon-high transition-colors hover:not-data-disabled:text-icon-higher',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
        ].join(' ')}
      >
        <X className="size-020" aria-hidden />
      </Modal.Close>
    </HStack>
  );
}
