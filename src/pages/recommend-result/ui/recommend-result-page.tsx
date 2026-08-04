'use client';

import { useState, type JSX } from 'react';
import NumberFlow from '@number-flow/react';
import { useReducedMotion } from 'motion/react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { openChannelDetailModal } from '@/features/channel-detail';
import {
  MAX_COMPARISON_CHANNELS,
  toggleComparisonChannel,
} from '@/pages/recommend-result/model/comparison-selection';
import { getRecommendedChannelDetail } from '@/pages/recommend-result/model/recommended-channel-details';
import {
  recommendedChannels,
  type RecommendedChannel,
} from '@/pages/recommend-result/model/recommended-channels';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

import { RecommendedChannelGrid } from './recommended-channel-grid';
import { RecommendResultSubHeader } from './recommend-result-sub-header';

type RecommendResultPageProps = {
  isGuest?: boolean;
};

export function RecommendResultPage({ isGuest = false }: RecommendResultPageProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const serviceName = useRecommendOnboardingStore((state) => state.answer?.serviceName ?? '채소집');
  const [selectedChannelIds, setSelectedChannelIds] = useState<readonly string[]>([]);

  const handleToggleSelection = (channelId: string): void => {
    const change = toggleComparisonChannel(selectedChannelIds, channelId);

    if (change.result === 'max-reached') {
      // eslint-disable-next-line no-alert -- The design explicitly requires a native alert here.
      window.alert('비교 목록은 최대 3개까지 선택할 수 있어요.');
      return;
    }

    setSelectedChannelIds(change.ids);
  };

  const handleOpenDetail = (channel: RecommendedChannel): void => {
    openChannelDetailModal(getRecommendedChannelDetail(channel));
  };

  const handleCompare = (): void => {
    // eslint-disable-next-line no-alert -- The comparison page is not available yet.
    window.alert('비교 기능은 준비 중이에요.');
  };

  return (
    <main className="bg-surface-background-default flex flex-1 flex-col items-center">
      <RecommendResultSubHeader serviceName={serviceName} />
      <Box className="px-016 pb-040 sm:px-032 flex w-full justify-center pt-[60px] lg:px-120">
        <Box className="gap-040 flex w-full max-w-[1200px] flex-col">
          <RecommendedChannelGrid
            channels={recommendedChannels}
            startDelay={0.14}
            selectedChannelIds={selectedChannelIds}
            isGuest={isGuest}
            onOpenDetail={handleOpenDetail}
            onToggleSelection={handleToggleSelection}
          />
          <Button
            frame="cta"
            tone="primary"
            className="h-[50px] w-full"
            aria-label={`추천받은 채널로 비교하기 (${selectedChannelIds.length}/${MAX_COMPARISON_CHANNELS})`}
            disabled={selectedChannelIds.length !== MAX_COMPARISON_CHANNELS}
            onClick={handleCompare}
          >
            추천받은 채널로 비교하기 (
            <NumberFlow
              value={selectedChannelIds.length}
              trend={0}
              animated={!shouldReduceMotion}
              transformTiming={{ duration: 600, easing: 'ease-out' }}
              opacityTiming={{ duration: 300, easing: 'ease-out' }}
            />
            /{MAX_COMPARISON_CHANNELS})
          </Button>
        </Box>
      </Box>
    </main>
  );
}
