'use client';

import type { JSX } from 'react';

import { ChannelSelectionScreen } from '@/features/channel-selection';
import { ChannelDetailContentSkeleton, openChannelDetailModal } from '@/features/channel-detail';

const COMPARE_SELECTION_LIMIT_TOAST = {
  id: 'compare-selection-limit',
  message: '채널 비교는 최대 3개까지만 선택 가능해요.',
} as const;

type CompareChannelSelectionProps = {
  onComplete: (channelIds: readonly string[]) => void;
};

export function CompareChannelSelection({ onComplete }: CompareChannelSelectionProps): JSX.Element {
  return (
    <ChannelSelectionScreen
      title="비교할 채널을 선택해 주세요"
      submitLabel="선택한 채널 비교하기"
      onComplete={onComplete}
      variant="comparison"
      limitToast={COMPARE_SELECTION_LIMIT_TOAST}
      onViewDetail={(channel) => {
        openChannelDetailModal({
          channel,
          fallback: <ChannelDetailContentSkeleton />,
        });
      }}
    />
  );
}
