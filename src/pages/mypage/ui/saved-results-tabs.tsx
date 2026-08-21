'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

import type {
  SavedRecommendation,
  SavedResult,
  SavedResultTabKind,
} from '@/pages/mypage/model/my-page-content';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

import { SavedResultSkeletonList } from './my-page-skeleton';

type SavedResultPanelKind = 'recommendation' | 'comparison' | 'simulation';

type SavedResultPanelProps = {
  isLoggedIn: boolean;
  kind: SavedResultPanelKind;
  recommendations?: readonly SavedRecommendation[];
  results?: readonly SavedResult[];
  previewLimit?: number;
  linkRecommendations?: boolean;
  isLoading?: boolean;
  isError?: boolean;
};

type SavedResultsTabsProps = {
  isLoggedIn: boolean;
  recommendations?: readonly SavedRecommendation[];
  comparisons?: readonly SavedResult[];
  simulations?: readonly SavedResult[];
  previewLimit?: number;
  linkRecommendations?: boolean;
  recommendationsLoading?: boolean;
  recommendationsError?: boolean;
  comparisonsLoading?: boolean;
  comparisonsError?: boolean;
  simulationsLoading?: boolean;
  simulationsError?: boolean;
  value?: SavedResultTabKind;
  onValueChange?: (value: SavedResultTabKind) => void;
};

const SAVED_RESULT_EMPTY_STATES = {
  recommendation: {
    description: '아직 저장된 추천 결과가 없어요',
    actionLabel: '채널 추천받기',
    href: '/recommend',
  },
  comparison: {
    description: '아직 저장된 비교 결과가 없어요',
    actionLabel: '채널 비교하기',
    href: '/compare',
  },
  simulation: {
    description: '아직 저장된 시뮬레이션 결과가 없어요',
    actionLabel: '시뮬레이션 하기',
    href: '/simulator',
  },
} as const;

function SavedRecommendationCard({
  recommendation,
  linkToDetail,
}: {
  recommendation: SavedRecommendation;
  linkToDetail: boolean;
}): JSX.Element {
  const content = (
    <Box className="bg-surface-lowest border-outline-low px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border">
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
    </Box>
  );

  if (!linkToDetail) {
    return content;
  }

  return (
    <Link
      href={`/recommend/saved/${recommendation.id}`}
      aria-label={`${recommendation.title} 저장된 추천 결과`}
      className="focus-visible:outline-sys-primary-default block w-full rounded-[var(--radius-s)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {content}
    </Link>
  );
}

function SavedResultCard({
  result,
  kind,
}: {
  result: SavedResult;
  kind: 'comparison' | 'simulation';
}): JSX.Element {
  const content = (
    <>
      <Box className="gap-010 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 flex w-full flex-col">
          <Text as="h3" variant="subtitle-md" className="text-text-high">
            {result.title}
          </Text>
          <Text as="p" variant="body-sm" className="text-text-low">
            {kind === 'comparison' ? '마지막 비교' : '마지막 시뮬레이션'} : {result.savedAt}
          </Text>
        </Box>
        <Box className="gap-006 flex max-w-full items-center overflow-hidden">
          {result.channelNames.map((channelName) => (
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
    </>
  );

  if (kind === 'simulation') {
    return (
      <Link
        href={`/simulator/saved/${result.id}`}
        aria-label={`${result.title} 저장된 시뮬레이션 결과`}
        className="bg-surface-lowest border-outline-low focus-visible:outline-sys-primary-default px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={`/compare/saved/${result.id}`}
      aria-label={`${result.title} 저장된 채널 비교 결과`}
      className="bg-surface-lowest border-outline-low focus-visible:outline-sys-primary-default px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {content}
    </Link>
  );
}

function SavedResultPanel({
  isLoggedIn,
  kind,
  recommendations = [],
  results = [],
  previewLimit,
  linkRecommendations = false,
  isLoading = false,
  isError = false,
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

  if (isLoading) {
    return <SavedResultSkeletonList testId={`${kind}-results-skeleton`} announceLoading />;
  }

  if (isError) {
    return (
      <Text
        as="p"
        variant="body-xl"
        role="alert"
        className="text-text-low flex h-[96px] w-full items-center justify-center text-center"
      >
        저장된 결과를 불러오지 못했어요
      </Text>
    );
  }

  if (kind === 'recommendation' && recommendations.length > 0) {
    const visibleRecommendations =
      previewLimit === undefined ? recommendations : recommendations.slice(0, previewLimit);

    return (
      <Box className="gap-010 mt-018 flex w-full flex-col">
        {visibleRecommendations.map((recommendation) => (
          <SavedRecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            linkToDetail={linkRecommendations}
          />
        ))}
      </Box>
    );
  }

  if (kind !== 'recommendation' && results.length > 0) {
    const visibleResults = previewLimit === undefined ? results : results.slice(0, previewLimit);

    return (
      <Box className="gap-010 mt-018 flex w-full flex-col">
        {visibleResults.map((result) => (
          <SavedResultCard key={result.id} result={result} kind={kind} />
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

export function SavedResultsTabList(): JSX.Element {
  return (
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
  );
}

export function SavedResultsTabs({
  isLoggedIn,
  recommendations = [],
  comparisons = [],
  simulations = [],
  previewLimit,
  linkRecommendations = false,
  recommendationsLoading = false,
  recommendationsError = false,
  comparisonsLoading = false,
  comparisonsError = false,
  simulationsLoading = false,
  simulationsError = false,
  value,
  onValueChange,
}: SavedResultsTabsProps): JSX.Element {
  const [internalValue, setInternalValue] = useState<SavedResultTabKind>('recommendation');
  const resolvedValue = value ?? internalValue;
  const handleValueChange = onValueChange ?? setInternalValue;

  return (
    <Tabs.Root
      value={resolvedValue}
      onValueChange={(nextValue) => handleValueChange(nextValue as SavedResultTabKind)}
      className="w-full"
    >
      <SavedResultsTabList />
      <Tabs.Panel value="recommendation">
        <SavedResultPanel
          isLoggedIn={isLoggedIn}
          kind="recommendation"
          recommendations={recommendations}
          previewLimit={previewLimit}
          linkRecommendations={linkRecommendations}
          isLoading={recommendationsLoading}
          isError={recommendationsError}
        />
      </Tabs.Panel>
      <Tabs.Panel value="comparison">
        <SavedResultPanel
          isLoggedIn={isLoggedIn}
          kind="comparison"
          results={comparisons}
          previewLimit={previewLimit}
          isLoading={comparisonsLoading}
          isError={comparisonsError}
        />
      </Tabs.Panel>
      <Tabs.Panel value="simulation">
        <SavedResultPanel
          isLoggedIn={isLoggedIn}
          kind="simulation"
          results={simulations}
          previewLimit={previewLimit}
          isLoading={simulationsLoading}
          isError={simulationsError}
        />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
