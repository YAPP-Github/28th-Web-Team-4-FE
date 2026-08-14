'use client';

import { X } from 'lucide-react';
import { type JSX } from 'react';

import type { ManualPerformanceChannel } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { Badge } from '@/shared/ui/badge';
import { Flex } from '@/shared/ui/layout/flex';

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
          className="gap-004"
        >
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
        </Badge>
      ))}
    </Flex>
  );
}
