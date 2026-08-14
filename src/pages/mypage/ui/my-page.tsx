import type { JSX } from 'react';

import type { MyAdsCondition, SavedRecommendation } from '@/pages/mypage/model/my-page-content';
import { Box } from '@/shared/ui/layout/box';

import { AuthenticatedProfileCard } from './authenticated-profile-card';
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

function AccountActions(): JSX.Element {
  return (
    <Box className="gap-026 py-020 flex w-full items-center justify-center">
      <button
        type="button"
        className="typo-subtitle-xs text-text-low focus-visible:outline-sys-primary-default rounded-xxs cursor-pointer underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        로그아웃
      </button>
      <button
        type="button"
        className="typo-subtitle-xs text-text-low focus-visible:outline-sys-primary-default rounded-xxs cursor-pointer underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        탈퇴하기
      </button>
    </Box>
  );
}

export function MyPage({
  isLoggedIn = false,
  isLoading = false,
  adsCondition,
  savedRecommendations,
}: MyPageProps): JSX.Element {
  if (isLoggedIn && isLoading) {
    return <MyPageSkeleton />;
  }

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[var(--radius-l)]">
      <MyPageSubHeader />
      <Box className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center overflow-clip xl:px-[324px]">
        <Box className="gap-016 py-024 flex w-full max-w-[792px] flex-1 flex-col">
          {isLoggedIn ? <AuthenticatedProfileCard /> : <GuestProfileCard />}
          {isLoggedIn && adsCondition ? <MyAdsConditionCard tags={adsCondition.tags} /> : null}
          <SavedResultsCard isLoggedIn={isLoggedIn} recommendations={savedRecommendations} />
          {isLoggedIn ? <AccountActions /> : null}
        </Box>
      </Box>
    </main>
  );
}
