'use client';

import type { JSX } from 'react';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { recommendedChannels } from '@/pages/recommend-result/model/recommended-channels';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

import { RecommendedChannelGrid } from './recommended-channel-grid';
import { RecommendResultSubHeader } from './recommend-result-sub-header';

export function RecommendResultPage(): JSX.Element {
  const serviceName = useRecommendOnboardingStore((state) => state.answer?.serviceName ?? '채소집');

  return (
    <main className="bg-surface-background-default flex flex-1 flex-col items-center">
      <Box className="px-016 pb-040 pt-040 sm:px-032 flex w-full justify-center lg:px-120">
        <Box className="gap-040 flex w-full max-w-[1200px] flex-col">
          <RecommendResultSubHeader serviceName={serviceName} />
          <RecommendedChannelGrid channels={recommendedChannels} startDelay={0.14} />
          <Button
            frame="cta"
            tone="third"
            className="bg-btn-sub-selected text-text-medium h-[50px] w-full"
            disabled
          >
            추천받은 채널로 비교하기 (0/3)
          </Button>
        </Box>
      </Box>
    </main>
  );
}
