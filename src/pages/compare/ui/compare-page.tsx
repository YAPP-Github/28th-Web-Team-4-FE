'use client';

import { Suspense, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { createChannelComparisonHref } from '@/features/channel-comparison';
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { trackClientEvent } from '@/shared/lib/analytics/track-client';

import { CompareChannelSelection } from './compare-channel-selection';

export function ComparePage(): JSX.Element {
  const router = useRouter();

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
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
    </main>
  );
}
