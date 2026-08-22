'use client';

import { useState, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import type { SimulationResponse } from '@/shared/api/generated';

import { Box } from '@/shared/ui/layout/box';

import { SimulatorCalculationNote } from './simulator-calculation-note';
import { SimulatorChannelResults } from './simulator-channel-results';
import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';
import { SimulatorResultSummary } from './simulator-result-summary';
import { SimulatorSubHeader } from './simulator-sub-header';
import { SimulatorTutorialGate } from './simulator-tutorial-gate';

function createSimulatorResultHref(
  channelIds: readonly string[],
  preserveFilterOpen = false,
): string {
  const searchParams = new URLSearchParams();

  for (const channelId of channelIds) {
    searchParams.append('channelIds', channelId);
  }

  if (preserveFilterOpen) {
    searchParams.set('filterOpen', 'true');
  }

  return channelIds.length > 0 ? `/simulator?${searchParams.toString()}` : '/simulator';
}

export type SimulatorPageProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
  selectedChannelIds?: readonly string[];
  initialSimulationResult?: SimulationResponse | null;
  isSavedResult?: boolean;
  initialFilterOpen?: boolean;
};

export function SimulatorPage({
  isLogin,
  isChannelSelectionComplete = false,
  selectedChannelIds = [],
  initialSimulationResult = null,
  isSavedResult = false,
  initialFilterOpen = false,
}: SimulatorPageProps): JSX.Element {
  const router = useRouter();
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(
    initialSimulationResult,
  );
  const loginHref = `/login?returnTo=${encodeURIComponent(
    createSimulatorResultHref(selectedChannelIds, initialFilterOpen),
  )}`;
  const contentBottomSpacerClassName =
    !isSavedResult && isLogin && isChannelSelectionComplete
      ? 'h-[calc(120px+env(safe-area-inset-bottom))]'
      : 'h-[calc(40px+env(safe-area-inset-bottom))]';

  const handleChannelRemove = (channelId: string): void => {
    const nextChannelIds = selectedChannelIds.filter((selectedId) => selectedId !== channelId);

    setSimulationResult(null);
    router.replace(createSimulatorResultHref(nextChannelIds, true), { scroll: false });
  };

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      {isSavedResult ? null : <SimulatorTutorialGate />}
      <SimulatorSubHeader
        simulationResult={simulationResult}
        showSaveAction={!isSavedResult}
        title={isSavedResult ? '저장된 시뮬레이션 결과예요' : undefined}
      />
      <Box className="bg-surface-low px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-020 pt-040 flex w-full max-w-[792px] flex-col">
          <SimulatorResultSummary simulationResult={simulationResult} />
          <SimulatorChannelResults
            isLogin={isLogin}
            isChannelSelectionComplete={isChannelSelectionComplete}
            loginHref={loginHref}
            selectedChannelIds={selectedChannelIds}
            simulationResult={simulationResult}
          />
          <SimulatorCalculationNote />
          <Box aria-hidden className={`${contentBottomSpacerClassName} shrink-0`} />
        </Box>
      </Box>
      {!isSavedResult && isLogin && isChannelSelectionComplete ? (
        <SimulatorChannelSelectionButton
          selectedChannelIds={selectedChannelIds}
          initialFilterOpen={initialFilterOpen}
          onSimulationResult={setSimulationResult}
          onChannelRemove={handleChannelRemove}
        />
      ) : null}
    </main>
  );
}
