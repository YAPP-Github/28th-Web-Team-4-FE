'use client';

import type { JSX } from 'react';

import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';
import { Avatar } from '@/shared/ui/avatar';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

export type ChannelDetailHeaderProps = {
  channel: ChannelDetailHeaderData;
  title?: JSX.Element;
  description?: JSX.Element;
};

export function ChannelDetailHeader({
  channel,
  title,
  description,
}: ChannelDetailHeaderProps): JSX.Element {
  return (
    <HStack className="gap-012 min-w-0 flex-1 items-center">
      <Avatar
        src={channel.iconUrl?.trim()}
        alt={`${channel.name} 로고`}
        fallback={<Skeleton className="size-full" />}
        className="border-outline-low size-[56px] rounded-[var(--radius-m)] border hover:ring-0"
      />
      <Stack className="gap-004 min-w-0 flex-1 items-start">
        {title ?? (
          <Text as="h2" variant="display-lg" className="text-text-high m-0 truncate">
            {channel.name}
          </Text>
        )}
        {description ?? (
          <Text as="p" variant="subtitle-xxs" className="text-text-low m-0 line-clamp-2">
            {channel.description ?? '채널 설명이 아직 없어요.'}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}
