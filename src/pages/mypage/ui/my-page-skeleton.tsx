'use client';

import type { JSX, ReactNode } from 'react';
import { Pencil } from 'lucide-react';

import { Avatar } from '@/shared/ui/avatar';
import { Box } from '@/shared/ui/layout/box';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { MyPageSubHeader } from './my-page-sub-header';

function SkeletonCardFrame({
  children,
  labelledBy,
}: {
  children: ReactNode;
  labelledBy: string;
}): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby={labelledBy}
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      {children}
    </Box>
  );
}

function ProfileSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame labelledBy="profile-skeleton-title">
      <Box className="flex w-full items-center justify-between">
        <Text
          as="h2"
          id="profile-skeleton-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          내 정보
        </Text>
        <button
          type="button"
          aria-label="내 정보 수정"
          className="focus-visible:outline-sys-primary-default size-018 rounded-xxs flex cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Pencil aria-hidden="true" className="text-icon-low size-018" strokeWidth={1.6} />
        </button>
      </Box>
      <Box className="gap-018 flex w-full flex-col" data-testid="my-profile-skeleton">
        <Box className="bg-surface-lower rounded-m px-016 py-012 h-072 flex w-full items-center">
          <Box className="gap-014 h-048 flex w-full items-center">
            <Avatar className="size-048 hover:ring-0" alt="" />
            <Box className="flex h-[46px] min-w-0 flex-1 flex-col">
              <Box className="h-026 flex w-full items-center">
                <Skeleton className="h-020 w-[76px] rounded-[var(--radius-xxs)]" />
              </Box>
              <Box className="h-020 flex w-full items-center">
                <Skeleton className="h-010 w-[130px] rounded-full" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="gap-010 flex w-full flex-col">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </Box>
      </Box>
    </SkeletonCardFrame>
  );
}

function ProfileFieldSkeleton(): JSX.Element {
  return (
    <Box className="gap-012 h-022 flex w-full items-center">
      <Box className="h-022 w-036 flex shrink-0 items-center">
        <Skeleton className="h-010 w-[24px] rounded-full" />
      </Box>
      <Box className="h-022 flex min-w-0 flex-1 items-center">
        <Skeleton className="h-010 w-[50px] rounded-full" />
      </Box>
    </Box>
  );
}

function ConditionSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame labelledBy="my-ads-condition-skeleton-title">
      <Box className="gap-002 h-048 flex w-full flex-col">
        <Text
          as="h2"
          id="my-ads-condition-skeleton-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          내 광고 조건
        </Text>
        <Text as="p" variant="body-xl" className="text-text-low">
          온보딩에서 입력한 조건이에요
        </Text>
      </Box>
      <Box className="gap-008 flex w-full flex-wrap items-start">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-032 w-[74px] rounded-[var(--radius-xxs)]" />
        ))}
      </Box>
      <button
        type="button"
        className="typo-body-xl bg-btn-sub-low text-text-default border-btn-sub-selected focus-visible:outline-sys-primary-default h-036 px-020 py-008 w-full cursor-pointer rounded-[var(--radius-s)] border transition-opacity outline-none hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-100"
      >
        수정하기
      </button>
    </SkeletonCardFrame>
  );
}

function SavedRecommendationSkeleton(): JSX.Element {
  return (
    <Box className="bg-surface-lowest border-outline-low px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border">
      <Box className="gap-010 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 h-042 flex w-full flex-col">
          <Box className="h-022 flex w-full items-center">
            <Skeleton className="h-010 w-[70px] rounded-full" />
          </Box>
          <Box className="h-018 flex w-full items-center">
            <Skeleton className="h-010 w-[82px] rounded-full" />
          </Box>
        </Box>
        <Box className="gap-006 flex items-center">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-022 w-[76px] rounded-[var(--radius-xxs)]" />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function SavedResultsSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame labelledBy="saved-results-skeleton-title">
      <Box className="gap-010 flex w-full flex-col">
        <Text
          as="h2"
          id="saved-results-skeleton-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          저장된 결과
        </Text>
        <Tabs.Root defaultValue="recommendation" className="w-full">
          <Tabs.List className="gap-008 h-[44px] items-start">
            <Tabs.Tab
              value="recommendation"
              className="pt-012 pb-012 flex h-[44px] w-[70px] flex-col items-center justify-start px-0"
            >
              채널 추천
            </Tabs.Tab>
            <Tabs.Tab
              value="comparison"
              className="pt-012 pb-012 flex h-[44px] w-[70px] flex-col items-center justify-start px-0"
            >
              채널 비교
            </Tabs.Tab>
            <Tabs.Tab
              value="simulation"
              className="pt-012 pb-012 flex h-[44px] w-[90px] flex-col items-center justify-start px-0"
            >
              예산 시뮬레이션
            </Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="recommendation">
            <Box className="gap-010 mt-018 flex w-full flex-col">
              {Array.from({ length: 3 }, (_, index) => (
                <SavedRecommendationSkeleton key={index} />
              ))}
            </Box>
          </Tabs.Panel>
        </Tabs.Root>
      </Box>
    </SkeletonCardFrame>
  );
}

function AccountActionsSkeleton(): JSX.Element {
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

export function MyPageSkeleton(): JSX.Element {
  return (
    <main
      aria-busy="true"
      className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[var(--radius-l)]"
    >
      <MyPageSubHeader />
      <Box
        role="status"
        aria-label="마이페이지를 불러오고 있어요"
        className="bg-surface-background-default px-016 sm:px-032 lg:px-064 flex min-h-0 flex-1 flex-col items-center overflow-clip xl:px-[324px]"
      >
        <Box className="gap-016 py-024 flex w-full max-w-[792px] flex-1 flex-col">
          <ProfileSkeletonCard />
          <ConditionSkeletonCard />
          <SavedResultsSkeletonCard />
          <AccountActionsSkeleton />
        </Box>
      </Box>
    </main>
  );
}
