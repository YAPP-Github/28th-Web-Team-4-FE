'use client';

/** 채널별 인사이트 카드를 접고 펼칠 수 있는 결과 섹션으로 구성한다. */

import type { JSX } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { Text } from '@/shared/ui/text';

import {
  CompareResultChannelInsightCard,
  type CompareResultChannelInsightVariant,
} from './compare-result-channel-insight-card';

type CompareResultChannelInsightsProps = {
  channels: readonly CompareResultChannel[];
  variant?: CompareResultChannelInsightVariant;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** 선택한 채널의 인사이트 목록을 하나의 Collapsible 영역으로 표시한다. */
export function CompareResultChannelInsights({
  channels,
  variant = 'stacked',
  defaultOpen = true,
  open,
  onOpenChange,
}: CompareResultChannelInsightsProps): JSX.Element {
  const [firstChannel, ...remainingChannels] = channels;

  return (
    <Collapsible.Root
      render={
        <section
          aria-labelledby="compare-result-channel-insights-title"
          className="bg-surface-lowest px-030 py-024 w-full rounded-[var(--radius-l)]"
        />
      }
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <h2>
        <Collapsible.Trigger className="focus-visible:outline-sys-primary-default group p-000 flex w-full cursor-pointer items-center justify-between bg-transparent text-left outline-none focus-visible:rounded-[var(--radius-xs)] focus-visible:outline-2 focus-visible:outline-offset-2">
          <Text
            as="span"
            id="compare-result-channel-insights-title"
            variant="heading-lg"
            className="text-text-highest"
          >
            채널별 인사이트
          </Text>
          <ChevronDown
            aria-hidden="true"
            className="text-icon-default ease-in-out-quart size-[26px] shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180 motion-reduce:transition-none"
            strokeWidth={1.6}
          />
        </Collapsible.Trigger>
      </h2>

      {firstChannel ? (
        <div className="pt-024">
          <CompareResultChannelInsightCard channel={firstChannel} variant={variant} />
        </div>
      ) : null}

      <Collapsible.Panel className="ease-in-out-quart h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none [&[hidden]:not([hidden='until-found'])]:hidden">
        {remainingChannels.length > 0 ? (
          <div className="gap-008 pt-008 flex flex-col">
            {remainingChannels.map((channel) => (
              <CompareResultChannelInsightCard
                key={channel.id}
                channel={channel}
                variant={variant}
              />
            ))}
          </div>
        ) : null}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
