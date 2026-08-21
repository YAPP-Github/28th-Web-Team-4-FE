'use client';

import type { JSX } from 'react';

import { useMyOnboardingTag } from '@/pages/mypage/api/use-my-onboarding-tag';
import {
  createMyAdsCondition,
  type MyAdsCondition,
  type SavedChannelComparison,
  type SavedRecommendation,
  type SavedSimulation,
} from '@/pages/mypage/model/my-page-content';
import { Box } from '@/shared/ui/layout/box';

import { AuthenticatedProfileCard } from './authenticated-profile-card';
import { AccountActions } from './account-actions';
import { GuestProfileCard } from './guest-profile-card';
import { MyAdsConditionCard } from './my-ads-condition-card';
import { MyAdsConditionSkeletonCard, MyPageSkeleton } from './my-page-skeleton';
import { MyPageSubHeader } from './my-page-sub-header';
import { SavedResultsCard } from './saved-results-card';

export type MyPageProps = {
  isLoggedIn?: boolean;
  isLoading?: boolean;
  adsCondition?: MyAdsCondition;
  savedRecommendations?: readonly SavedRecommendation[];
  savedComparisons?: readonly SavedChannelComparison[];
  savedSimulations?: readonly SavedSimulation[];
  isComparisonsLoading?: boolean;
  isComparisonsError?: boolean;
  isSimulationsLoading?: boolean;
  isSimulationsError?: boolean;
  savedRecommendationsLoading?: boolean;
  savedRecommendationsError?: boolean;
};

export function MyPage({
  isLoggedIn = false,
  isLoading = false,
  adsCondition,
  savedRecommendations,
  savedComparisons,
  savedSimulations,
  isComparisonsLoading = false,
  isComparisonsError = false,
  isSimulationsLoading = false,
  isSimulationsError = false,
  savedRecommendationsLoading = false,
  savedRecommendationsError = false,
}: MyPageProps): JSX.Element {
  const onboardingTagQuery = useMyOnboardingTag(isLoggedIn && !adsCondition);
  const resolvedAdsCondition =
    adsCondition ??
    (onboardingTagQuery.data ? createMyAdsCondition(onboardingTagQuery.data) : undefined);
  const isAdsConditionLoading =
    isLoggedIn && !adsCondition && onboardingTagQuery.isPending === true;
  let adsConditionContent: JSX.Element | null = null;

  if (isLoggedIn && resolvedAdsCondition) {
    adsConditionContent = <MyAdsConditionCard tags={resolvedAdsCondition.tags} />;
  } else if (isAdsConditionLoading) {
    adsConditionContent = <MyAdsConditionSkeletonCard />;
  }

  if (isLoggedIn && isLoading) {
    return <MyPageSkeleton />;
  }

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[var(--radius-l)]">
      <MyPageSubHeader />
      <Box className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 touch-pan-y flex-col items-center overflow-y-auto overscroll-y-contain xl:px-[324px]">
        <Box className="gap-016 py-024 flex w-full max-w-[792px] flex-1 flex-col">
          {isLoggedIn ? <AuthenticatedProfileCard /> : <GuestProfileCard />}
          {adsConditionContent}
          <SavedResultsCard
            isLoggedIn={isLoggedIn}
            recommendations={savedRecommendations}
            comparisons={savedComparisons}
            simulations={savedSimulations}
            isComparisonsLoading={isComparisonsLoading}
            isComparisonsError={isComparisonsError}
            isSimulationsLoading={isSimulationsLoading}
            isSimulationsError={isSimulationsError}
            recommendationsLoading={savedRecommendationsLoading}
            recommendationsError={savedRecommendationsError}
          />
          {isLoggedIn ? <AccountActions /> : null}
        </Box>
      </Box>
    </main>
  );
}
