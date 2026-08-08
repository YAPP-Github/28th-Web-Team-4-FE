'use client';

import type { JSX } from 'react';

import { ChannelSelectionScreen } from '@/features/channel-selection';
import { showWarningToast } from '@/shared/ui/toast';

const COMPARE_COMING_SOON_TOAST_ID = 'compare-coming-soon';
const COMPARE_COMING_SOON_TOAST_MESSAGE = '채널 비교 기능은 준비 중이에요.';
const COMPARE_SELECTION_LIMIT_TOAST = {
  id: 'compare-selection-limit',
  message: '채널 비교는 최대 3개까지만 선택 가능해요.',
} as const;

export function CompareChannelSelection(): JSX.Element {
  const handleComplete = () => {
    showWarningToast(COMPARE_COMING_SOON_TOAST_MESSAGE, {
      id: COMPARE_COMING_SOON_TOAST_ID,
    });
  };

  return (
    <ChannelSelectionScreen
      title="비교할 채널을 선택해 주세요"
      submitLabel="선택한 채널 비교하기"
      onComplete={handleComplete}
      limitToast={COMPARE_SELECTION_LIMIT_TOAST}
    />
  );
}
