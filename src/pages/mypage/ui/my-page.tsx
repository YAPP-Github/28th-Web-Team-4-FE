'use client';

import type { JSX } from 'react';

import { useMyOnboardingTag } from '@/pages/mypage/api/use-my-onboarding-tag';
import {
  createMyAdsCondition,
  type MyAdsCondition,
  type SavedRecommendation,
} from '@/pages/mypage/model/my-page-content';
import { Box } from '@/shared/ui/layout/box';

import { AuthenticatedProfileCard } from './authenticated-profile-card';
import { AccountActions } from './account-actions';
import { GuestProfileCard } from './guest-profile-card';
import { MyAdsConditionCard } from './my-ads-condition-card';
import { MyPageSkeleton } from './my-page-skeleton';
import { MyPageSubHeader } from './my-page-sub-header';
import { SavedResultsCard } from './saved-results-card';

type MyPageProps = {
  isLoggedIn?: boolean;
  isLoading?: boolean;
  adsCondition?: MyAdsCondition;
  savedRecommendations?: readonly SavedRecommendation[];
};

export function MyPage({
  isLoggedIn = false,
  isLoading = false,
  adsCondition,
  savedRecommendations,
}: MyPageProps): JSX.Element {
  const onboardingTagQuery = useMyOnboardingTag(isLoggedIn && !adsCondition);
  const resolvedAdsCondition =
    adsCondition ??
    (onboardingTagQuery.data ? createMyAdsCondition(onboardingTagQuery.data) : undefined);

  if (isLoggedIn && isLoading) {
    return <MyPageSkeleton />;
  }

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 touch-pan-y flex-col overflow-y-auto rounded-t-[var(--radius-l)]">
      <MyPageSubHeader />
      <Box className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center xl:px-[324px]">
        <Box className="gap-016 py-024 flex w-full max-w-[792px] flex-1 flex-col">
          {isLoggedIn ? <AuthenticatedProfileCard /> : <GuestProfileCard />}
          {isLoggedIn && resolvedAdsCondition ? (
            <MyAdsConditionCard tags={resolvedAdsCondition.tags} />
          ) : null}
          <SavedResultsCard isLoggedIn={isLoggedIn} recommendations={savedRecommendations} />
          {isLoggedIn ? <AccountActions /> : null}
        </Box>
      </Box>
    </main>
  );
}
