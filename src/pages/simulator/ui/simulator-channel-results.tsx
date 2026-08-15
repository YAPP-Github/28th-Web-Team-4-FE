'use client';

import { useState, type JSX } from 'react';
import { Info } from 'lucide-react';
import type { SimulationResponse } from '@/shared/api/generated';

import { useSimulatorFilterChannels } from '@/features/simulator-filter/api/use-simulator-filter-channels';
import type { SimulatorFilterChannel } from '@/features/simulator-filter/model/simulator-filter-options';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { Tooltip } from '@/shared/ui/tooltip';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';
import { GuestChannelResults } from './simulator-guest-results';
import {
  SimulatorResultsViewToggle,
  type SimulatorResultsView,
} from './simulator-channel-performance';

type SimulatorChannelResultsProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
  selectedChannelIds?: readonly string[];
  simulationResult?: SimulationResponse | null;
};

const NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');

function formatChannelCost(channel: SimulatorFilterChannel): string | null {
  if (!channel.cost) {
    return null;
  }

  const { cost } = channel;
  const value =
    cost.valueMax !== null && cost.valueMax !== cost.value
      ? `${NUMBER_FORMATTER.format(cost.value)}~${NUMBER_FORMATTER.format(cost.valueMax)}`
      : NUMBER_FORMATTER.format(cost.value);

  return cost.pricingModel === 'CPM'
    ? `${channel.name} 노출 1,000회 당 약 ${value}원`
    : `${channel.name} ${value}원`;
}

function ChannelCostInfo({
  channels,
  isEnabled,
}: {
  channels: readonly SimulatorFilterChannel[];
  isEnabled: boolean;
}): JSX.Element {
  const infoIcon = <Info aria-hidden className="size-full" strokeWidth={1.8} />;
  const costLines = channels.flatMap((channel) => {
    const cost = formatChannelCost(channel);

    return cost ? [{ id: channel.id, text: cost }] : [];
  });

  if (!isEnabled) {
    return (
      <Box aria-hidden className="text-icon-default size-018 flex items-center justify-center">
        {infoIcon}
      </Box>
    );
  }

  return (
    <Tooltip.Root placement="right-start" offset={{ mainAxis: 10, crossAxis: 8 }}>
      <Tooltip.Anchor>
        <button
          type="button"
          aria-label="채널별 클릭당 비용 안내"
          className="text-icon-default focus-visible:outline-outline-selected size-018 flex items-center justify-center rounded-full outline-offset-2 focus-visible:outline-2"
        >
          {infoIcon}
        </button>
      </Tooltip.Anchor>
      <Tooltip.Content
        showArrow={false}
        className="bg-surface-lowest p-016 shadow-drop-shadow-02 pointer-events-none invisible items-start rounded-[var(--radius-m)] rounded-tl-none opacity-0 transition-opacity duration-150 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100"
      >
        <span className="gap-008 flex flex-col items-start">
          <span className="typo-subtitle-sm text-text-high">채널별 클릭당 비용</span>
          <span className="typo-body-xs text-text-medium gap-002 flex flex-col items-start whitespace-nowrap">
            {costLines.length > 0 ? (
              costLines.map(({ id, text }) => <span key={id}>{text}</span>)
            ) : (
              <span>등록된 비용 정보가 없어요.</span>
            )}
          </span>
        </span>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SimulatorChannelResults({
  isLogin,
  isChannelSelectionComplete = false,
  selectedChannelIds = [],
  simulationResult = null,
}: SimulatorChannelResultsProps): JSX.Element {
  const [view, setView] = useState<SimulatorResultsView>('graph');
  const resultsTitle = view === 'table' ? '채널별 예상 성과' : '채널별 예상 노출 · 클릭 수';
  const shouldLoadChannelCosts = isLogin && isChannelSelectionComplete;
  const { channels, isError, isPending } = useSimulatorFilterChannels(
    shouldLoadChannelCosts ? selectedChannelIds : [],
  );
  const isChannelCostInfoEnabled =
    shouldLoadChannelCosts &&
    !isPending &&
    !isError &&
    channels.length === selectedChannelIds.length &&
    selectedChannelIds.length > 0;

  return (
    <Box
      as="section"
      aria-labelledby="simulator-channel-results-title"
      data-selected-channel-ids={selectedChannelIds.join(',') || undefined}
      data-simulation-result-state={simulationResult ? 'ready' : 'initial'}
      className="bg-surface-lowest gap-026 px-030 py-024 relative flex w-full shrink-0 flex-col overflow-hidden rounded-[var(--radius-l)]"
    >
      <Box className="flex w-full items-center justify-between">
        <Box className="gap-006 group flex items-center">
          <Text
            as="h2"
            id="simulator-channel-results-title"
            variant="heading-lg"
            className="text-text-highest"
          >
            {resultsTitle}
          </Text>
          <ChannelCostInfo channels={channels} isEnabled={isChannelCostInfoEnabled} />
        </Box>
        <SimulatorResultsViewToggle view={view} onViewChange={setView} />
      </Box>
      {isLogin ? (
        <AuthenticatedChannelResults
          isChannelSelectionComplete={isChannelSelectionComplete}
          selectedChannelIds={selectedChannelIds}
          simulationResult={simulationResult}
          view={view}
        />
      ) : (
        <GuestChannelResults view={view} />
      )}
    </Box>
  );
}
