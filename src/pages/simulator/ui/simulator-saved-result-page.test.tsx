import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import type { SimulationResponse } from '@/shared/api/generated';
import { vi } from 'vitest';

import { SimulatorSavedResultPage } from './simulator-saved-result-page';

const { simulatorPageMock, useSavedSimulationMock } = vi.hoisted(() => ({
  simulatorPageMock: vi.fn<(props: Record<string, unknown>) => ReactElement>(),
  useSavedSimulationMock: vi.fn<
    () => {
      data?: { data: SimulationResponse };
      isError: boolean;
      isPending: boolean;
    }
  >(),
}));

vi.mock('@/pages/simulator/api/use-saved-simulation', () => ({
  useSavedSimulation: useSavedSimulationMock,
}));

vi.mock('./simulator-page', () => ({
  SimulatorPage: (props: Record<string, unknown>) => {
    simulatorPageMock(props);
    return <div data-testid="simulator-page" />;
  },
}));

const SAVED_SIMULATION: SimulationResponse = {
  simulationId: 'simulation-1',
  totalBudgetWon: 1_000_000,
  period: 'M1',
  totalEstImpressions: 12_000,
  totalEstClicks: 300,
  executableChannelCount: 1,
  items: [
    {
      channelId: 'channel-1',
      channelName: '채널 1',
      iconUrl: null,
      channelProductId: null,
      allocatedBudgetWon: 1_000_000,
      allocationPct: 100,
      estImpressions: { min: 10_000, max: 14_000 },
      estClicks: { min: 250, max: 350 },
      cpcWon: 300,
      cpmWon: null,
      minBudgetWon: 100_000,
      isExecutable: true,
      shortfallWon: null,
      basisNote: '매체 소개서 기반',
    },
  ],
};

describe('SimulatorSavedResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('injects the saved result and channel ids into the existing simulator screen', () => {
    useSavedSimulationMock.mockReturnValue({
      data: { data: SAVED_SIMULATION },
      isError: false,
      isPending: false,
    });

    render(<SimulatorSavedResultPage simulationId="simulation-1" />);

    expect(screen.getByTestId('simulator-page')).toBeVisible();
    expect(simulatorPageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isLogin: true,
        isSavedResult: true,
        isChannelSelectionComplete: true,
        selectedChannelIds: ['channel-1'],
        initialSimulationResult: SAVED_SIMULATION,
      }),
    );
  });
});
