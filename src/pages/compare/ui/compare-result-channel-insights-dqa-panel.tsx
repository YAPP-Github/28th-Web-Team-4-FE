'use client';

/** URL을 직접 조작하며 채널 인사이트 후보 UI를 비교하는 Leva 패널을 제공한다. */

import type { JSX } from 'react';
import { LevaPanel, useControls, useCreateStore } from 'leva';
import { useQueryState } from 'nuqs';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';

import {
  COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
  type CompareResultChannelInsightVariant,
} from './compare-result-channel-insight-card';
import { CompareResultChannelInsights } from './compare-result-channel-insights';
import {
  channelInsightOpenParser,
  channelInsightVariantParser,
} from './compare-result-channel-insights-dqa-query';

type CompareResultChannelInsightsDqaPanelProps = {
  channels: readonly CompareResultChannel[];
};

/** 쿼리 상태를 단일 소스로 사용해 결과 섹션과 Leva 컨트롤을 함께 갱신한다. */
export function CompareResultChannelInsightsDqaPanel({
  channels,
}: CompareResultChannelInsightsDqaPanelProps): JSX.Element {
  const [variant, setVariant] = useQueryState('insightVariant', channelInsightVariantParser);
  const [open, setOpen] = useQueryState('insightOpen', channelInsightOpenParser);
  const store = useCreateStore();

  useControls(
    {
      variant: {
        value: variant,
        options: COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
        label: '카드 레이아웃',
        onChange: (
          nextVariant: CompareResultChannelInsightVariant,
          _path: string,
          context: { initial: boolean },
        ) => {
          if (!context.initial && nextVariant !== variant) {
            void setVariant(nextVariant);
          }
        },
      },
      open: {
        value: open,
        label: '전체 펼치기',
        onChange: (nextOpen: boolean, _path: string, context: { initial: boolean }) => {
          if (!context.initial && nextOpen !== open) {
            void setOpen(nextOpen);
          }
        },
      },
    },
    { store },
    [open, setOpen, setVariant, variant],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    void setOpen(nextOpen);
  };

  return (
    <>
      <CompareResultChannelInsights
        channels={channels}
        variant={variant}
        open={open}
        onOpenChange={handleOpenChange}
      />
      <div className="bottom-024 fixed left-1/2 z-[1000] w-[min(280px,calc(100vw-32px))] -translate-x-1/2">
        <LevaPanel
          store={store}
          fill
          hideCopyButton
          oneLineLabels
          titleBar={{
            title: '채널 인사이트 DQA',
            drag: false,
            filter: false,
          }}
        />
      </div>
    </>
  );
}
