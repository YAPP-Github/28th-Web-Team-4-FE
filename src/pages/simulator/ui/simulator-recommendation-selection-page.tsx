'use client';

import { useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Pagination } from '@/shared/ui/pagination';
import { Text } from '@/shared/ui/text';

import {
  SIMULATOR_RECOMMENDATION_CHANNEL_LIMIT,
  SIMULATOR_RECOMMENDATION_SELECTION_PAGE_SIZE,
  SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW,
  type SimulatorRecommendationChannel,
  type SimulatorRecommendationSelection,
} from '@/pages/simulator/model/simulator-recommendation-selection';

import { SimulatorSubHeader } from './simulator-sub-header';

const CHECK_ICON_SRC = '/channel-selection-assets/check.svg';

type RecommendationSelectionScreenProps = {
  recommendations: readonly SimulatorRecommendationSelection[];
  onComplete: (channelIds: readonly string[]) => void;
};

function SelectionIndicator({ selected }: { selected: boolean }): JSX.Element {
  return (
    <Box
      aria-hidden
      className={cn(
        'flex size-016 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none',
        selected ? 'bg-sys-primary-default' : 'bg-icon-low',
      )}
    >
      <Image src={CHECK_ICON_SRC} alt="" width={9} height={7} className="h-[7px] w-[9px]" />
    </Box>
  );
}

function RecommendationSummary({
  recommendation,
  expanded,
  onToggle,
}: {
  recommendation: SimulatorRecommendationSelection;
  expanded: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={`추천 결과 ${recommendation.title} ${expanded ? '접기' : '펼치기'}`}
      onClick={onToggle}
      className="gap-012 focus-visible:outline-sys-primary-default flex w-full items-start justify-between text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Box className="gap-012 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 flex w-full flex-col items-start">
          <Text as="p" variant="body-sm" className="text-text-low">
            {recommendation.date}
          </Text>
          <Text as="h2" variant="subtitle-xxl" className="text-text-high">
            {recommendation.title}
          </Text>
        </Box>
        <Box className="gap-006 flex w-full flex-wrap items-center">
          {recommendation.channels.map((channel) => (
            <Badge key={channel.id} frame="badge" tone="deep-gray">
              {channel.name}
            </Badge>
          ))}
        </Box>
      </Box>
      <SelectionIndicator selected={expanded} />
    </button>
  );
}

function RecommendationChannelButton({
  channel,
  selected,
  onToggle,
}: {
  channel: SimulatorRecommendationChannel;
  selected: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${channel.name} 선택`}
      onClick={onToggle}
      className={cn(
        'typo-subtitle-xxs flex min-h-[44px] min-w-0 flex-1 items-center rounded-[var(--radius-s)] border px-014 py-010 text-left outline-none transition-colors motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
        selected
          ? 'border-outline-selected bg-sys-primary-lowest text-text-primary'
          : 'border-outline-lower bg-surface-lowest text-text-high',
      )}
    >
      {channel.name}
    </button>
  );
}

function RecommendationChannelSelection({
  channels,
  selectedChannelIds,
  onToggle,
}: {
  channels: readonly SimulatorRecommendationChannel[];
  selectedChannelIds: ReadonlySet<string>;
  onToggle: (channelId: string) => void;
}): JSX.Element {
  return (
    <Box className="gap-008 mt-010 flex w-full flex-col items-start">
      <Text as="p" variant="body-sm" className="text-text-medium w-full">
        * 비교할 채널을 3개 선택해 주세요
      </Text>
      <Box className="gap-008 grid w-full grid-cols-1 sm:grid-cols-2">
        {channels.map((channel) => (
          <RecommendationChannelButton
            key={channel.id}
            channel={channel}
            selected={selectedChannelIds.has(channel.id)}
            onToggle={() => onToggle(channel.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

function RecommendationCard({
  recommendation,
  expanded,
  selectedChannelIds,
  onToggle,
  onToggleChannel,
}: {
  recommendation: SimulatorRecommendationSelection;
  expanded: boolean;
  selectedChannelIds: ReadonlySet<string>;
  onToggle: () => void;
  onToggleChannel: (channelId: string) => void;
}): JSX.Element {
  return (
    <Box
      as="article"
      aria-label={`추천 결과 ${recommendation.title}`}
      className={cn(
        'bg-surface-lowest box-border w-full rounded-[var(--radius-s)] border px-018 py-016',
        expanded ? 'border-outline-selected' : 'border-transparent',
      )}
    >
      <RecommendationSummary
        recommendation={recommendation}
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded ? (
        <RecommendationChannelSelection
          channels={recommendation.channels}
          selectedChannelIds={selectedChannelIds}
          onToggle={onToggleChannel}
        />
      ) : null}
    </Box>
  );
}

function RecommendationSelectionEmptyState(): JSX.Element {
  return (
    <Box className="bg-surface-background-default flex min-h-0 flex-1 justify-center overflow-y-auto">
      <Box className="gap-016 pb-024 flex w-full max-w-[996px] flex-col items-center pt-[180px]">
        <Image
          src="/simulator-assets/recommendation-empty-state.png"
          alt=""
          width={235}
          height={191}
          className="h-[191px] w-[235px] shrink-0"
        />
        <Box className="gap-022 flex flex-col items-center">
          <Box className="gap-004 flex flex-col items-center text-center">
            <Text as="p" variant="heading-lg" className="text-text-default">
              저장된 추천 결과가 없어요
            </Text>
            <Text as="p" variant="body-xl" className="text-text-medium">
              맞춤 추천을 받아 결과를 저장해 보세요.
            </Text>
          </Box>
          <Button
            frame="button"
            tone="secondary"
            size="m"
            nativeButton={false}
            render={<Link href="/recommend" />}
            leftIcon={<Image src="/simulator-assets/plus.svg" alt="" width={16} height={16} />}
          >
            채널 추천받기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function RecommendationSelectionBottomNavigation({
  currentPage,
  totalPages,
  canSubmit,
  onPageChange,
  onComplete,
}: {
  currentPage: number;
  totalPages: number;
  canSubmit: boolean;
  onPageChange: (page: number) => void;
  onComplete: () => void;
}): JSX.Element {
  return (
    <Box className="border-outline-low bg-surface-lowest px-016 sm:px-032 flex h-[102px] w-full shrink-0 justify-center border-t lg:px-120">
      <Box className="gap-016 py-020 md:py-000 grid w-full max-w-[1200px] grid-cols-1 items-center md:grid-cols-[1fr_auto_1fr]">
        <Box aria-hidden className="hidden md:block" />
        <Box className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Box>
        <Box className="flex justify-center md:justify-end">
          <Button
            frame="button"
            tone="secondary"
            size="m"
            disabled={!canSubmit}
            onClick={onComplete}
            className="h-[44px] w-full max-w-[320px]"
          >
            선택하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export function SimulatorRecommendationSelectionScreen({
  recommendations,
  onComplete,
}: RecommendationSelectionScreenProps): JSX.Element {
  const [expandedRecommendationId, setExpandedRecommendationId] = useState<string | null>(null);
  const [selectedChannelIds, setSelectedChannelIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const canSubmit = selectedChannelIds.size === SIMULATOR_RECOMMENDATION_CHANNEL_LIMIT;
  const totalPages = Math.max(
    1,
    Math.ceil(recommendations.length / SIMULATOR_RECOMMENDATION_SELECTION_PAGE_SIZE),
  );
  const visibleRecommendations = recommendations.slice(
    (currentPage - 1) * SIMULATOR_RECOMMENDATION_SELECTION_PAGE_SIZE,
    currentPage * SIMULATOR_RECOMMENDATION_SELECTION_PAGE_SIZE,
  );

  const handleRecommendationToggle = (recommendationId: string): void => {
    const nextId = expandedRecommendationId === recommendationId ? null : recommendationId;

    setExpandedRecommendationId(nextId);
    setSelectedChannelIds(new Set());
  };

  const handleChannelToggle = (channelId: string): void => {
    setSelectedChannelIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(channelId)) {
        nextIds.delete(channelId);
      } else if (nextIds.size < SIMULATOR_RECOMMENDATION_CHANNEL_LIMIT) {
        nextIds.add(channelId);
      }

      return nextIds;
    });
  };

  const handleComplete = (): void => {
    if (!canSubmit) {
      return;
    }

    onComplete([...selectedChannelIds]);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    setExpandedRecommendationId(null);
    setSelectedChannelIds(new Set());
  };

  if (recommendations.length === 0) {
    return <RecommendationSelectionEmptyState />;
  }

  return (
    <>
      <Box className="bg-surface-background-default px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-014 py-024 flex w-full max-w-[792px] flex-col items-center">
          {visibleRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              expanded={expandedRecommendationId === recommendation.id}
              selectedChannelIds={selectedChannelIds}
              onToggle={() => handleRecommendationToggle(recommendation.id)}
              onToggleChannel={handleChannelToggle}
            />
          ))}
        </Box>
      </Box>
      <RecommendationSelectionBottomNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        canSubmit={canSubmit}
        onPageChange={handlePageChange}
        onComplete={handleComplete}
      />
    </>
  );
}

export type SimulatorRecommendationSelectionPageProps = {
  recommendations?: readonly SimulatorRecommendationSelection[];
};

export function SimulatorRecommendationSelectionPage({
  recommendations = SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW,
}: SimulatorRecommendationSelectionPageProps = {}): JSX.Element {
  const router = useRouter();

  const handleComplete = (channelIds: readonly string[]): void => {
    const searchParams = new URLSearchParams();

    for (const channelId of channelIds) {
      searchParams.append('channelIds', channelId);
    }

    router.push(`/simulator?${searchParams.toString()}`);
  };

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <SimulatorSubHeader title="불러올 추천 결과를 선택해 주세요" showSaveAction={false} />
      <SimulatorRecommendationSelectionScreen
        recommendations={recommendations}
        onComplete={handleComplete}
      />
    </main>
  );
}
