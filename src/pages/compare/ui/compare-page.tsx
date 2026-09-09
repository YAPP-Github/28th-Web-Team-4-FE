'use client';

import { Suspense, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { createChannelComparisonHref } from '@/features/channel-comparison';
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { trackClientEvent } from '@/shared/lib/analytics/track-client';

import { CompareChannelSelection } from './compare-channel-selection';
import { Stack } from '@/shared/ui/layout/stack';

export function ComparePage(): JSX.Element {
  const router = useRouter();

  return (
    <Stack as="main" className="bg-surface-background-default min-h-0 flex-1 overflow-hidden">
      <Suspense>
        <CompareChannelSelection
          onComplete={(channelIds) => {
            trackClientEvent(ANALYTICS_EVENTS.channelComparisonStarted, {
              selected_channel_count: channelIds.length,
            });
            router.push(createChannelComparisonHref(channelIds));
          }}
        />
      </Suspense>
    </Stack>
  );
}
