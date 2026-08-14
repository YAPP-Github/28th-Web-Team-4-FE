import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { AuthenticatedProfileCard } from './authenticated-profile-card';
import { GuestProfileCard } from './guest-profile-card';
import { SavedResultsCard } from './saved-results-card';

type MyPageProps = {
  isLoggedIn?: boolean;
};

function MyPageSubHeader(): JSX.Element {
  return (
    <Box className="border-outline-low bg-surface-lowest min-h-072 px-016 sm:px-032 flex w-full shrink-0 justify-center border-y lg:px-120">
      <Box className="py-016 flex w-full max-w-[1200px] items-center md:py-0">
        <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
          내 정보와 저장된 추천 결과를 관리해요
        </Text>
      </Box>
    </Box>
  );
}

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

export function MyPage({ isLoggedIn = false }: MyPageProps): JSX.Element {
  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[var(--radius-l)]">
      <MyPageSubHeader />
      <Box className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center overflow-clip xl:px-[324px]">
        <Box className="gap-016 py-024 flex w-full max-w-[792px] flex-1 flex-col">
          {isLoggedIn ? <AuthenticatedProfileCard /> : <GuestProfileCard />}
          <SavedResultsCard isLoggedIn={isLoggedIn} />
          {isLoggedIn ? <AccountActions /> : null}
        </Box>
      </Box>
    </main>
  );
}
