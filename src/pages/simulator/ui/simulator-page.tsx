import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';

import { SimulatorCalculationNote } from './simulator-calculation-note';
import { SimulatorChannelResults } from './simulator-channel-results';
import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';
import { SimulatorResultSummary } from './simulator-result-summary';
import { SimulatorSubHeader } from './simulator-sub-header';

export type SimulatorPageProps = {
  isLogin: boolean;
  isChannelSelectionComplete?: boolean;
};

export function SimulatorPage({
  isLogin,
  isChannelSelectionComplete = false,
}: SimulatorPageProps): JSX.Element {
  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <SimulatorSubHeader />
      <Box className="bg-surface-low px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-020 py-040 flex w-full max-w-[792px] flex-col">
          <SimulatorResultSummary />
          <SimulatorChannelResults
            isLogin={isLogin}
            isChannelSelectionComplete={isChannelSelectionComplete}
          />
          <SimulatorCalculationNote />
        </Box>
      </Box>
      {isLogin && isChannelSelectionComplete ? <SimulatorChannelSelectionButton /> : null}
    </main>
  );
}
