'use client';

import type { JSX } from 'react';
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
        <Box className="gap-006 flex items-center">
          <Text
            as="h2"
            id="simulator-channel-results-title"
            variant="heading-lg"
            className="text-text-highest"
          >
            채널별 예상 노출 · 클릭 수
          </Text>
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
