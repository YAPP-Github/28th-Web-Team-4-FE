'use client';

/**
 * 광고 성과 직접 입력에서 선택된 채널 목록을 삭제 가능한 태그로 표시한다.
 */

import { X } from 'lucide-react';
import { type JSX } from 'react';

import type { ManualPerformanceChannel } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { Badge } from '@/shared/ui/badge';
import { Flex } from '@/shared/ui/layout/flex';

/**
 * 선택된 광고 채널 목록을 태그 형태로 렌더링한다.
 *
 * @param props.channelList 선택된 직접 입력 채널 목록
 * @param props.onRemove 채널 제거 콜백
 */
export function SelectedPerformanceChannelTags({
  channelList,
  onRemove,
}: {
  channelList: ManualPerformanceChannel[];
  onRemove: (index: number) => void;
}): JSX.Element | null {
  if (channelList.length === 0) {
    return null;
  }

  return (
    <Flex className="gap-010 flex-wrap">
      {channelList.map((channel, index) => (
        <Badge
          key={`${channel.channelId ?? 'custom'}-${channel.channelNameRaw}`}
          frame="tag"
          tone="orange"
        >
          <span className="gap-004 inline-flex items-center">
            <span>{channel.channelNameRaw}</span>
            <button
              type="button"
              className={[
                'text-icon-primary-low flex size-014 shrink-0 items-center justify-center rounded-[var(--radius-xxs)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-high',
              ].join(' ')}
              aria-label={`${channel.channelNameRaw} 삭제`}
              onClick={() => onRemove(index)}
            >
              <X aria-hidden className="size-012" strokeWidth={2} />
            </button>
          </span>
        </Badge>
      ))}
    </Flex>
  );
}
