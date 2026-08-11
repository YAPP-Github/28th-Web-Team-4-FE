'use client';

import { useState, type JSX, type ReactNode } from 'react';
import NumberFlow from '@number-flow/react';
import { Download } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { openResolvedChannelDetailModal } from '@/features/channel-detail/resolved';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { useRecommendations } from '@/pages/recommend-result/api/use-recommendations';
import { useSaveRecommendation } from '@/pages/recommend-result/api/use-save-recommendation';
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
import { showWarningToast } from '@/shared/ui/toast';

import { RecommendedChannelCarousel } from './recommended-channel-carousel';
import { RecommendResultSubHeader } from './recommend-result-sub-header';

type RecommendResultPageProps = {
  channels?: readonly RecommendedChannel[];
  headerAction: ReactNode;
  isGuest?: boolean;
};

type RecommendResultWithRecommendationsProps = {
  isGuest?: boolean;
  onboardingId: string;
};

const NUMBER_FLOW_EASE_OUT_CUBIC = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const SAVE_RECOMMENDATION_ERROR_TOAST_ID = 'recommend-result-save-error';
const SAVE_RECOMMENDATION_ERROR_MESSAGE = '추천 결과 저장 중 문제가 발생했습니다.';
const SAVE_RECOMMENDATION_BUTTON_LABEL = {
  idle: '결과 저장하기',
  pending: '저장 중',
  saved: '저장 완료',
} as const;

type SaveRecommendationButtonStatus = keyof typeof SAVE_RECOMMENDATION_BUTTON_LABEL;

function getSaveRecommendationButtonStatus({
  isPending,
  isSuccess,
}: {
  isPending: boolean;
  isSuccess: boolean;
}): SaveRecommendationButtonStatus {
  if (isPending) {
    return 'pending';
  }

  if (isSuccess) {
    return 'saved';
  }

  return 'idle';
}

export function RecommendResultPage({
  channels = recommendedChannels,
  headerAction,
  isGuest = false,
}: RecommendResultPageProps): JSX.Element {
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
    openResolvedChannelDetailModal(getRecommendedChannelDetail(channel));
  };

  const handleCompare = (): void => {
    // eslint-disable-next-line no-alert -- The comparison page is not available yet.
    window.alert('비교 기능은 준비 중이에요.');
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
    />
  );
}

function RecommendResultSaveAction({ onboardingId }: { onboardingId: string }): JSX.Element {
  const saveRecommendation = useSaveRecommendation();
  const isSaved = saveRecommendation.isSuccess;
  const isDisabled = saveRecommendation.isPending || isSaved;
  const status = getSaveRecommendationButtonStatus({
    isPending: saveRecommendation.isPending,
    isSuccess: saveRecommendation.isSuccess,
  });

  const handleSave = (): void => {
    if (isDisabled) {
      return;
    }

    saveRecommendation.mutate(
      {
        body: {
          onboardingId,
        },
      },
      {
        onError: (error) => {
          showWarningToast(getApiErrorMessage(error, SAVE_RECOMMENDATION_ERROR_MESSAGE), {
            id: SAVE_RECOMMENDATION_ERROR_TOAST_ID,
          });
        },
      },
    );
  };

  return (
    <Button
      frame="button"
      tone="stroke"
      className="border-outline-low h-044 px-020 py-010 w-full lg:w-auto"
      disabled={isDisabled}
      leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
      onClick={handleSave}
    >
      {SAVE_RECOMMENDATION_BUTTON_LABEL[status]}
    </Button>
  );
}
