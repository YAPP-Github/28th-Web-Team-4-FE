'use client';

import type { JSX } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { channelDetailQueryOptions } from '@/features/channel-detail/api/channel-detail-query';
import { ChannelDetailContent } from '@/features/channel-detail/ui/channel-detail-content';

export function ChannelDetailQuery({
  channelId,
  onboardingId,
}: {
  channelId: string;
  onboardingId?: string;
}): JSX.Element {
  const { data: channel } = useSuspenseQuery(channelDetailQueryOptions(channelId, onboardingId));

  return <ChannelDetailContent channel={channel} />;
}
