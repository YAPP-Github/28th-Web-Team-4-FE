import { render, screen } from '@testing-library/react';
import type { SimulationResponse } from '@/shared/api/generated';

import { SimulatorResultSummary } from './simulator-result-summary';

vi.mock('@number-flow/react', () => ({
  default: ({ suffix, value }: { suffix?: string; value: number }) => (
    <span>
      {new Intl.NumberFormat('ko-KR').format(value)}
      {suffix}
    </span>
  ),
}));

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}));

const SIMULATION_RESULT: SimulationResponse = {
  simulationId: null,
  totalBudgetWon: 1_000_000,
  period: 'M1',
  totalEstImpressions: 38_000,
  totalEstClicks: 1_100,
  executableChannelCount: 2,
  items: [],
};

describe('SimulatorResultSummary', () => {
  it('응답 수치를 표시한다', () => {
    render(<SimulatorResultSummary simulationResult={SIMULATION_RESULT} />);

    expect(screen.getByText('2개')).toBeVisible();
    expect(screen.getByText('3.8만 회')).toBeVisible();
    expect(screen.getByText('1,100회')).toBeVisible();
  });
});
