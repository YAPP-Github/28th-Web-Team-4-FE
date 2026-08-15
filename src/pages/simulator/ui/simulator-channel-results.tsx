'use client';

import type { JSX } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { Info } from 'lucide-react';
import type { SimulationResponse } from '@/shared/api/generated';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';
import { GuestChannelResults } from './simulator-guest-results';
import { SimulatorResultsViewToggle } from './simulator-channel-performance';

type SimulatorChannelResultsProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
  selectedChannelIds?: readonly string[];
  simulationResult?: SimulationResponse | null;
};

function ChannelCostInfo({ isEnabled }: { isEnabled: boolean }): JSX.Element {
  const infoIcon = <Info aria-hidden className="size-full" strokeWidth={1.8} />;

  if (!isEnabled) {
    return (
      <Box aria-hidden className="text-icon-default size-018 flex items-center justify-center">
        {infoIcon}
      </Box>
    );
  }

  return (
    <BaseTooltip.Provider delay={150} timeout={400}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          aria-label="채널별 클릭당 비용 안내"
          delay={0}
          className="text-icon-default focus-visible:outline-outline-selected size-018 inline-flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {infoIcon}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side="bottom"
            align="start"
            sideOffset={2}
            collisionPadding={8}
            positionMethod="fixed"
            className="z-50"
          >
            <BaseTooltip.Popup
              role="tooltip"
              className="bg-surface-lowest p-016 shadow-drop-shadow-02 w-max max-w-[calc(100vw-32px)] rounded-[var(--radius-m)] rounded-tl-none"
            >
              <Box className="gap-008 flex flex-col items-start">
                <span className="typo-subtitle-sm text-text-high">채널별 클릭당 비용</span>
                <span className="typo-body-xs text-text-medium whitespace-nowrap">
                  네이버 검색 광고 580원
                  <br />
                  카카오모먼트 410원
                  <br />
                  뉴스 캐시 노출 1,000회 당 약 3,500원
                </span>
              </Box>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export function SimulatorChannelResults({
  isLogin,
  isChannelSelectionComplete = false,
  selectedChannelIds = [],
  simulationResult = null,
}: SimulatorChannelResultsProps): JSX.Element {
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
            채널별 예상 노출 · 클릭 수
          </Text>
          <ChannelCostInfo isEnabled={isChannelSelectionComplete} />
        </Box>
        <SimulatorResultsViewToggle />
      </Box>
      {isLogin ? (
        <AuthenticatedChannelResults
          isChannelSelectionComplete={isChannelSelectionComplete}
          selectedChannelIds={selectedChannelIds}
          simulationResult={simulationResult}
        />
      ) : (
        <GuestChannelResults />
      )}
    </Box>
  );
}
