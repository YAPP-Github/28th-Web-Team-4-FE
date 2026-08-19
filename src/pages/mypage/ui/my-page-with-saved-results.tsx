'use client';

import type { JSX } from 'react';

import { useMyChannelComparisons } from '@/pages/mypage/api/use-my-channel-comparisons';
import { useMySimulations } from '@/pages/mypage/api/use-my-simulations';
import { createSavedRecommendations } from '@/pages/mypage/model/my-page-content';
import { MyPage, type MyPageProps } from '@/pages/mypage/ui/my-page';
import { useMyRecommendations } from '@/shared/api/use-my-recommendations';

export type MyPageWithSavedResultsProps = Omit<
  MyPageProps,
  | 'savedComparisons'
  | 'savedSimulations'
  | 'isComparisonsLoading'
  | 'isComparisonsError'
  | 'isSimulationsLoading'
  | 'isSimulationsError'
  | 'savedRecommendations'
  | 'savedRecommendationsLoading'
  | 'savedRecommendationsError'
>;

/** 마이페이지에 저장된 채널 비교·시뮬레이션 목록 API를 주입한다. */
export function MyPageWithSavedResults({
  isLoggedIn = false,
  ...props
}: MyPageWithSavedResultsProps): JSX.Element {
  const comparisonsQuery = useMyChannelComparisons(isLoggedIn);
  const simulationsQuery = useMySimulations(isLoggedIn);
  const recommendationsQuery = useMyRecommendations({ enabled: isLoggedIn });
  const recommendations = recommendationsQuery.data?.data.content;

  return (
    <MyPage
      {...props}
      isLoggedIn={isLoggedIn}
      savedRecommendations={
        recommendations ? createSavedRecommendations(recommendations) : undefined
      }
      savedRecommendationsLoading={isLoggedIn && recommendationsQuery.isPending}
      savedRecommendationsError={isLoggedIn && recommendationsQuery.isError}
      savedComparisons={comparisonsQuery.data}
      savedSimulations={simulationsQuery.data}
      isComparisonsLoading={comparisonsQuery.isPending}
      isComparisonsError={comparisonsQuery.isError}
      isSimulationsLoading={simulationsQuery.isPending}
      isSimulationsError={simulationsQuery.isError}
    />
  );
}
