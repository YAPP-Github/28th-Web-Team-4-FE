'use client';

import type { JSX } from 'react';

import { useSavedSimulation } from '@/pages/simulator/api/use-saved-simulation';
import { Box } from '@/shared/ui/layout/box';
import { Placeholder } from '@/shared/ui/placeholder';

import { SimulatorPage } from './simulator-page';
import { SimulatorSubHeader } from './simulator-sub-header';

function SavedSimulationState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <SimulatorSubHeader title="저장된 시뮬레이션 결과" showSaveAction={false} />
      <Box className="bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center">
        <Placeholder title={title} subtitle={subtitle} />
      </Box>
    </main>
  );
}

export function SimulatorSavedResultPage({ simulationId }: { simulationId: string }): JSX.Element {
  const simulationQuery = useSavedSimulation(simulationId);

  if (simulationQuery.isPending) {
    return (
      <SavedSimulationState
        title="시뮬레이션 결과를 불러오고 있어요"
        subtitle="저장된 결과를 준비하고 있습니다"
      />
    );
  }

  if (simulationQuery.isError) {
    return (
      <SavedSimulationState
        title="시뮬레이션 결과를 불러오지 못했어요"
        subtitle="잠시 후 다시 시도해 주세요"
      />
    );
  }

  const simulationResult = simulationQuery.data.data;
  const selectedChannelIds = simulationResult.items.map((item) => item.channelId);

  return (
    <SimulatorPage
      isLogin
      isChannelSelectionComplete={selectedChannelIds.length > 0}
      selectedChannelIds={selectedChannelIds}
      initialSimulationResult={simulationResult}
      isSavedResult
    />
  );
}
