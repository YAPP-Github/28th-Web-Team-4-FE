'use client';

import { useState, type JSX } from 'react';
import type { SimulationResponse } from '@/shared/api/generated';

import { Box } from '@/shared/ui/layout/box';

import { SimulatorCalculationNote } from './simulator-calculation-note';
import { SimulatorChannelResults } from './simulator-channel-results';
import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';
import { SimulatorResultSummary } from './simulator-result-summary';
import { SimulatorSubHeader } from './simulator-sub-header';
import { SimulatorTutorialGate } from './simulator-tutorial-gate';

export type SimulatorPageProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
  selectedChannelIds?: readonly string[];
  initialSimulationResult?: SimulationResponse | null;
  isSavedResult?: boolean;
};

export function SimulatorPage({
  isLogin,
  isChannelSelectionComplete = false,
  selectedChannelIds = [],
  initialSimulationResult = null,
  isSavedResult = false,
}: SimulatorPageProps): JSX.Element {
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(
    initialSimulationResult,
  );

  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      {isSavedResult ? null : <SimulatorTutorialGate />}
      <SimulatorSubHeader
        simulationResult={simulationResult}
        showSaveAction={!isSavedResult}
        title={isSavedResult ? '저장된 시뮬레이션 결과예요' : undefined}
      />
      <Box className="bg-surface-low px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto lg:px-120">
        <Box
          className={
            isLogin && isChannelSelectionComplete
              ? 'gap-020 pt-040 flex w-full max-w-[792px] flex-col'
              : 'gap-020 py-040 flex w-full max-w-[792px] flex-col'
          }
        >
          <SimulatorResultSummary simulationResult={simulationResult} />
          <SimulatorChannelResults
            isLogin={isLogin}
            isChannelSelectionComplete={isChannelSelectionComplete}
            selectedChannelIds={selectedChannelIds}
            simulationResult={simulationResult}
          />
          <SimulatorCalculationNote />
          {!isSavedResult && isLogin && isChannelSelectionComplete ? (
            <Box aria-hidden className="h-120 shrink-0" />
          ) : null}
        </Box>
      </Box>
      {!isSavedResult && isLogin && isChannelSelectionComplete ? (
        <SimulatorChannelSelectionButton
          selectedChannelIds={selectedChannelIds}
          onSimulationResult={setSimulationResult}
        />
      ) : null}
    </main>
  );
}
