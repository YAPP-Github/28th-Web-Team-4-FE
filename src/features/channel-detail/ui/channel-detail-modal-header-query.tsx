'use client';

import type { JSX } from 'react';
import { useQuery } from '@tanstack/react-query';

import { channelDetailQueryOptions } from '@/features/channel-detail/api/channel-detail-query';
import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';
import { ChannelDetailModalHeader } from '@/features/channel-detail/ui/channel-detail-modal-header';
import { Stack } from '@/shared/ui/layout/stack';
import { Skeleton } from '@/shared/ui/skeleton';

function ChannelDetailTaglineSkeleton(): JSX.Element {
  return (
    <Stack
      role="status"
      aria-label="채널 설명을 불러오는 중이에요"
      className="h-044 w-full justify-center"
    >
      <Skeleton className="h-014 w-4/5 rounded-[var(--radius-xs)]" />
    </Stack>
  );
}

export function ChannelDetailModalHeaderQuery({
  channel,
  onboardingId,
}: {
  channel: ChannelDetailHeaderData;
  onboardingId?: string;
}): JSX.Element {
  const detailQuery = useQuery(channelDetailQueryOptions(channel.id, onboardingId));

  if (detailQuery.isPending) {
    return (
      <ChannelDetailModalHeader channel={channel} description={<ChannelDetailTaglineSkeleton />} />
    );
  }

  const tagline = detailQuery.data?.tagline ?? '채널 설명이 아직 없어요.';

  return <ChannelDetailModalHeader channel={channel} description={tagline} />;
}
