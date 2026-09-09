'use client';

import type { JSX, ReactNode } from 'react';
import { Pencil } from 'lucide-react';

import { Avatar } from '@/shared/ui/avatar';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { HStack } from '@/shared/ui/layout/h-stack';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { MyPageSubHeader } from './my-page-sub-header';

function SkeletonCardFrame({
  children,
  labelledBy,
  testId,
}: {
  children: ReactNode;
  labelledBy: string;
  testId?: string;
}): JSX.Element {
  return (
    <Stack
      as="section"
      aria-labelledby={labelledBy}
      data-testid={testId}
      className="bg-surface-lowest gap-018 px-030 py-024 w-full rounded-[var(--radius-l)]"
    >
      {children}
    </Stack>
  );
}

function ProfileSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame labelledBy="profile-skeleton-title">
      <JustifyBetween className="w-full items-center">
        <Text
          as="h2"
          id="profile-skeleton-title"
          variant="heading-lg"
          className="text-text-highest"
        >
          내 정보
        </Text>
        <Center
          as="button"
          type="button"
          aria-label="내 정보 수정"
          className="focus-visible:outline-sys-primary-default size-018 rounded-xxs cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Pencil aria-hidden="true" className="text-icon-low size-018" strokeWidth={1.6} />
        </Center>
      </JustifyBetween>
      <Stack className="gap-018 w-full" data-testid="my-profile-skeleton">
        <HStack className="bg-surface-lower rounded-m px-016 py-012 h-072 w-full">
          <HStack className="gap-014 h-048 w-full">
            <Avatar className="size-048 hover:ring-0" alt="" />
            <Stack className="h-[46px] min-w-0 flex-1">
              <HStack className="h-026 w-full">
                <Skeleton className="h-020 w-[76px] rounded-[var(--radius-xxs)]" />
              </HStack>
              <HStack className="h-020 w-full">
                <Skeleton className="h-010 w-[130px] rounded-full" />
              </HStack>
            </Stack>
          </HStack>
        </HStack>
        <Stack className="gap-010 w-full">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </Stack>
      </Stack>
    </SkeletonCardFrame>
  );
}

function ProfileFieldSkeleton(): JSX.Element {
  return (
    <HStack className="gap-012 h-022 w-full">
      <HStack className="h-022 w-036 shrink-0">
        <Skeleton className="h-010 w-[24px] rounded-full" />
      </HStack>
      <HStack className="h-022 min-w-0 flex-1">
        <Skeleton className="h-010 w-[50px] rounded-full" />
      </HStack>
    </HStack>
  );
}

export function MyAdsConditionSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame
      labelledBy="my-ads-condition-skeleton-title"
      testId="my-ads-condition-skeleton"
    >
      <Stack className="gap-002 h-048 w-full">
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
      </Stack>
      <Flex className="gap-008 w-full flex-wrap items-start">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-032 w-[74px] rounded-[var(--radius-xxs)]" />
        ))}
      </Flex>
      <button
        type="button"
        className="typo-body-xl bg-btn-sub-low text-text-default border-btn-sub-selected focus-visible:outline-sys-primary-default h-036 px-020 py-008 w-full cursor-pointer rounded-[var(--radius-s)] border transition-opacity outline-none hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-100"
      >
        수정하기
      </button>
    </SkeletonCardFrame>
  );
}

export function SavedResultSkeletonCard(): JSX.Element {
  return (
    <HStack className="bg-surface-lowest border-outline-low px-016 py-014 w-full rounded-[var(--radius-s)] border">
      <Stack className="gap-010 min-w-0 flex-1 items-start">
        <Stack className="gap-002 h-042 w-full">
          <HStack className="h-022 w-full">
            <Skeleton className="h-010 w-[70px] rounded-full" />
          </HStack>
          <HStack className="h-018 w-full">
            <Skeleton className="h-010 w-[82px] rounded-full" />
          </HStack>
        </Stack>
        <HStack className="gap-006">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-022 w-[76px] rounded-[var(--radius-xxs)]" />
          ))}
        </HStack>
      </Stack>
    </HStack>
  );
}

export function SavedResultSkeletonList({
  testId = 'saved-results-skeleton-list',
  announceLoading = false,
}: {
  testId?: string;
  announceLoading?: boolean;
}): JSX.Element {
  return (
    <Stack
      {...(announceLoading
        ? { role: 'status', 'aria-label': '저장된 결과를 불러오고 있어요' }
        : {})}
      data-testid={testId}
      className="gap-010 mt-018 w-full"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <SavedResultSkeletonCard key={index} />
      ))}
    </Stack>
  );
}

function SavedResultsSkeletonCard(): JSX.Element {
  return (
    <SkeletonCardFrame labelledBy="saved-results-skeleton-title">
      <Stack className="gap-010 w-full">
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
            <SavedResultSkeletonList />
          </Tabs.Panel>
        </Tabs.Root>
      </Stack>
    </SkeletonCardFrame>
  );
}

function AccountActionsSkeleton(): JSX.Element {
  return (
    <Center className="gap-026 py-020 w-full">
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
    </Center>
  );
}

export function MyPageSkeleton(): JSX.Element {
  return (
    <Stack
      as="main"
      aria-busy="true"
      className="bg-surface-background-default min-h-0 flex-1 overflow-hidden rounded-t-[var(--radius-l)]"
    >
      <MyPageSubHeader />
      <VStack
        role="status"
        aria-label="마이페이지를 불러오고 있어요"
        className="bg-surface-background-default px-016 sm:px-032 lg:px-064 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-y-contain xl:px-[324px]"
      >
        <Stack className="gap-016 py-024 w-full max-w-[792px] flex-1">
          <ProfileSkeletonCard />
          <MyAdsConditionSkeletonCard />
          <SavedResultsSkeletonCard />
          <AccountActionsSkeleton />
        </Stack>
      </VStack>
    </Stack>
  );
}
