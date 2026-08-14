'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

import type { SavedRecommendation } from '@/pages/mypage/model/my-page-content';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

type SavedResultPanelKind = 'recommendation' | 'comparison';

type SavedResultPanelProps = {
  isLoggedIn: boolean;
  kind?: SavedResultPanelKind;
  recommendations: readonly SavedRecommendation[];
};

const SAVED_RESULT_EMPTY_STATES = {
  recommendation: {
    description: '아직 저장된 추천 결과가 없어요',
    actionLabel: '채널 추천받기',
    href: '/recommend/onboarding/new',
  },
  comparison: {
    description: '아직 저장된 비교 결과가 없어요',
    actionLabel: '채널 비교하기',
    href: '/compare',
  },
} as const;

function SavedRecommendationCard({
  recommendation,
}: {
  recommendation: SavedRecommendation;
}): JSX.Element {
  return (
    <Link
      href={`/recommend/${recommendation.onboardingId}`}
      className="bg-surface-lowest border-outline-low focus-visible:outline-sys-primary-default px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Box className="gap-010 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 flex w-full flex-col">
          <Text as="h3" variant="subtitle-md" className="text-text-high">
            {recommendation.title}
          </Text>
          <Text as="p" variant="body-sm" className="text-text-low">
            마지막 추천 : {recommendation.lastRecommendedAt}
          </Text>
        </Box>
        <Box className="gap-006 flex max-w-full items-center overflow-hidden">
          {recommendation.channelNames.map((channelName) => (
            <Badge key={channelName} frame="badge" tone="deep-gray">
              {channelName}
            </Badge>
          ))}
        </Box>
      </Box>
      <ChevronRight
        aria-hidden="true"
        className="text-icon-low size-020 shrink-0"
        strokeWidth={1.5}
      />
    </Link>
  );
}

function SavedResultPanel({
  isLoggedIn,
  kind = 'recommendation',
  recommendations,
}: SavedResultPanelProps): JSX.Element {
  const emptyState = SAVED_RESULT_EMPTY_STATES[kind];

  if (!isLoggedIn) {
    return (
      <Text
        as="p"
        variant="body-xl"
        className="text-text-low flex h-[96px] w-full items-center justify-center text-center"
      >
        {emptyState.description}
      </Text>
    );
  }

  if (kind === 'recommendation' && recommendations.length > 0) {
    return (
      <Box className="gap-010 mt-018 flex w-full flex-col">
        {recommendations.slice(0, 3).map((recommendation) => (
          <SavedRecommendationCard
            key={recommendation.onboardingId}
            recommendation={recommendation}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box className="gap-014 py-020 mt-018 flex w-full flex-col items-center justify-end">
      <Text as="p" variant="body-xl" className="text-text-low text-center">
        {emptyState.description}
      </Text>
      <Button
        frame="button"
        tone="secondary"
        size="s"
        nativeButton={false}
        render={<Link href={emptyState.href} />}
        rightIcon={<ArrowRight aria-hidden="true" className="size-016" strokeWidth={1.5} />}
        className="flex-row"
      >
        {emptyState.actionLabel}
      </Button>
    </Box>
  );
}

type SavedResultsCardProps = {
  isLoggedIn: boolean;
  recommendations?: readonly SavedRecommendation[];
};

export function SavedResultsCard({
  isLoggedIn,
  recommendations = [],
}: SavedResultsCardProps): JSX.Element {
  const hasRecommendations = isLoggedIn && recommendations.length > 0;

  return (
    <Box
      as="section"
      aria-labelledby="saved-results-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      <Box className="gap-010 flex w-full flex-col">
        <Box className="flex w-full items-center">
          <Text
            as="h2"
            id="saved-results-title"
            variant="heading-lg"
            className="text-text-highest flex-1"
          >
            저장된 결과
          </Text>
          {hasRecommendations ? (
            <Link
              href="/mypage"
              className="gap-002 typo-body-sm text-text-low focus-visible:outline-sys-primary-default rounded-xxs flex items-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              더보기
              <ChevronRight aria-hidden="true" className="size-016" strokeWidth={1.5} />
            </Link>
          ) : null}
        </Box>
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
            <SavedResultPanel
              isLoggedIn={isLoggedIn}
              kind="recommendation"
              recommendations={recommendations}
            />
          </Tabs.Panel>
          <Tabs.Panel value="comparison">
            <SavedResultPanel isLoggedIn={isLoggedIn} kind="comparison" recommendations={[]} />
          </Tabs.Panel>
          <Tabs.Panel value="simulation">
            <SavedResultPanel isLoggedIn={isLoggedIn} recommendations={[]} />
          </Tabs.Panel>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
