'use client';

import { useState, type JSX, type ReactNode } from 'react';
import NumberFlow from '@number-flow/react';
import { useReducedMotion } from 'motion/react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { ChannelDetailContentSkeleton, openChannelDetailModal } from '@/features/channel-detail';
import { useRecommendations } from '@/pages/recommend-result/api/use-recommendations';
import {
  MAX_COMPARISON_CHANNELS,
  toggleComparisonChannel,
} from '@/pages/recommend-result/model/comparison-selection';
import { getRecommendedChannelDetailHeader } from '@/pages/recommend-result/model/recommended-channel-details';
import {
  recommendedChannels,
  type RecommendedChannel,
} from '@/pages/recommend-result/model/recommended-channels';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { showWarningToast } from '@/shared/ui/toast';

import { RecommendedChannelCarousel } from './recommended-channel-carousel';
import { RecommendResultSaveAction } from './recommend-result-save-action';
import { RecommendResultSubHeader } from './recommend-result-sub-header';

type RecommendResultPageProps = {
  channels?: readonly RecommendedChannel[];
  headerAction: ReactNode;
  isGuest?: boolean;
  onboardingId?: string;
};

type RecommendResultWithRecommendationsProps = {
  isGuest?: boolean;
  onboardingId: string;
};

const NUMBER_FLOW_EASE_OUT_CUBIC = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const COMPARISON_LIMIT_TOAST_ID = 'recommend-comparison-limit';
const COMPARISON_COMING_SOON_TOAST_ID = 'recommend-comparison-coming-soon';

export function RecommendResultPage({
  channels = recommendedChannels,
  headerAction,
  isGuest = false,
  onboardingId,
}: RecommendResultPageProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const serviceName = useRecommendOnboardingStore((state) => state.answer?.serviceName ?? '채소집');
  const [selectedChannelIds, setSelectedChannelIds] = useState<readonly string[]>([]);

  const handleToggleSelection = (channelId: string): void => {
    const change = toggleComparisonChannel(selectedChannelIds, channelId);

    if (change.result === 'max-reached') {
      showWarningToast('비교 목록은 최대 3개까지 선택할 수 있어요.', {
        id: COMPARISON_LIMIT_TOAST_ID,
      });
      return;
    }

    setSelectedChannelIds(change.ids);
  };

  const handleOpenDetail = (channel: RecommendedChannel): void => {
    openChannelDetailModal({
      channel: getRecommendedChannelDetailHeader(channel),
      onboardingId,
      fallback: <ChannelDetailContentSkeleton />,
    });
  };

  const handleCompare = (): void => {
    showWarningToast('비교 기능은 준비 중이에요.', {
      id: COMPARISON_COMING_SOON_TOAST_ID,
    });
  };

  return (
    <main className="bg-surface-background-default flex flex-1 flex-col items-center">
      <RecommendResultSubHeader serviceName={serviceName} action={headerAction} />
      <Box className="px-016 pb-040 sm:px-032 lg:px-064 flex w-full justify-center pt-[60px] xl:px-0">
        <Box className="gap-040 flex w-full max-w-[1200px] flex-col">
          <RecommendedChannelCarousel
            channels={channels}
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
              transformTiming={{ duration: 180, easing: NUMBER_FLOW_EASE_OUT_CUBIC }}
              opacityTiming={{ duration: 150, easing: NUMBER_FLOW_EASE_OUT_CUBIC }}
            />
            /{MAX_COMPARISON_CHANNELS})
          </Button>
        </Box>
      </Box>
    </main>
  );
}

export function RecommendResultWithRecommendations({
  isGuest = false,
  onboardingId,
}: RecommendResultWithRecommendationsProps): JSX.Element {
  const recommendationsQuery = useRecommendations(onboardingId);

  return (
    <RecommendResultPage
      channels={recommendationsQuery.data}
      headerAction={<RecommendResultSaveAction onboardingId={onboardingId} />}
      isGuest={isGuest}
      onboardingId={onboardingId}
    />
  );
}
