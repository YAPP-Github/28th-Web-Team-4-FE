'use client';

/**
 * 광고 성과 직접 입력에서 채널 하나의 아코디언 패널을 렌더링한다.
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import { type JSX } from 'react';
import { type FieldPath } from 'react-hook-form';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import type { ManualPerformanceChannel } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { Box } from '@/shared/ui/layout/box';

import { MANUAL_PERFORMANCE_FIELD_LIST, NumericPerformanceInput } from './performance-manual-field';

/**
 * 선택된 채널 하나의 성과 입력 필드를 접고 펼칠 수 있는 패널로 표시한다.
 *
 * @param props.index field array 내 채널 index
 * @param props.channel 표시할 채널 draft 값
 * @param props.isOpen 패널 열림 여부
 * @param props.onToggle 패널 열림 상태 토글 콜백
 */
export function PerformanceManualChannelPanel({
  index,
  channel,
  isOpen,
  onToggle,
}: {
  index: number;
  channel: ManualPerformanceChannel;
  isOpen: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <Box className="border-outline-low overflow-hidden rounded-[var(--radius-s)] border">
      <button
        type="button"
        aria-expanded={isOpen}
        className={[
          'typo-subtitle-xs text-text-high flex min-h-[44px] w-full items-center gap-012 px-016 py-012 text-left',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-outline-high',
        ].join(' ')}
        onClick={onToggle}
      >
        <span className="min-w-0 flex-1 truncate">{channel.channelNameRaw}</span>
        {isOpen ? (
          <ChevronUp aria-hidden className="text-icon-default size-020 shrink-0" />
        ) : (
          <ChevronDown aria-hidden className="text-icon-default size-020 shrink-0" />
        )}
      </button>

      {isOpen ? (
        <Box className="gap-014 px-016 pb-012 flex flex-col">
          <Box className="gap-010 flex">
            {MANUAL_PERFORMANCE_FIELD_LIST.slice(0, 2).map((field) => (
              <NumericPerformanceInput
                key={field.key}
                name={
                  `performanceManualChannelList.${index}.${field.key}` satisfies FieldPath<RecommendOnboardingDraft>
                }
                label={field.label}
                placeholder={field.placeholder}
                rightAddon={field.rightAddon}
                className={field.className}
              />
            ))}
          </Box>
          <Box className="gap-010 flex">
            {MANUAL_PERFORMANCE_FIELD_LIST.slice(2).map((field) => (
              <NumericPerformanceInput
                key={field.key}
                name={
                  `performanceManualChannelList.${index}.${field.key}` satisfies FieldPath<RecommendOnboardingDraft>
                }
                label={field.label}
                placeholder={field.placeholder}
                className={field.className}
              />
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
