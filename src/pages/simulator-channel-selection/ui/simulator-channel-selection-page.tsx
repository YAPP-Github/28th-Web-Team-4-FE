'use client';

import { Suspense, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { ChannelSelectionScreen } from '@/features/channel-selection';

function createSimulatorResultHref(channelIds: readonly string[]): string {
  const searchParams = new URLSearchParams();

  for (const channelId of channelIds) {
    searchParams.append('channelIds', channelId);
  }

  return `/simulator?${searchParams.toString()}`;
}

export function SimulatorChannelSelectionPage(): JSX.Element {
  const router = useRouter();

  const handleComplete = (channelIds: readonly string[]) => {
    router.push(createSimulatorResultHref(channelIds));
  };

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense>
        <ChannelSelectionScreen
          title="시뮬레이션할 채널을 선택해 주세요"
          submitLabel="시뮬레이션 실행하기"
          onComplete={handleComplete}
        />
      </Suspense>
    </main>
  );
}
