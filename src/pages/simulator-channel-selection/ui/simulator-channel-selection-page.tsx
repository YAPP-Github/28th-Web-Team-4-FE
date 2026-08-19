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

export type SimulatorChannelSelectionPageProps = {
  existingChannelIds?: readonly string[];
};

export function SimulatorChannelSelectionPage({
  existingChannelIds = [],
}: SimulatorChannelSelectionPageProps = {}): JSX.Element {
  const router = useRouter();
  const isAddingChannel = existingChannelIds.length > 0;

  const handleComplete = (channelIds: readonly string[]): void => {
    const nextChannelIds = [...new Set([...existingChannelIds, ...channelIds])];

    router.push(createSimulatorResultHref(nextChannelIds));
  };

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense>
        <ChannelSelectionScreen
          title={
            isAddingChannel ? '추가할 채널을 선택해 주세요' : '시뮬레이션할 채널을 선택해 주세요'
          }
          submitLabel={isAddingChannel ? '채널 추가하기' : '시뮬레이션 실행하기'}
          selectionLimit={isAddingChannel ? 1 : undefined}
          limitToast={
            isAddingChannel
              ? { id: 'simulator-add-channel-limit', message: '채널은 1개만 선택할 수 있어요.' }
              : undefined
          }
          onComplete={handleComplete}
        />
      </Suspense>
    </main>
  );
}
