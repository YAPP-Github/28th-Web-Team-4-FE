import { render, screen } from '@testing-library/react';

import { SimulatorSubHeader } from './simulator-sub-header';

vi.mock('@/pages/simulator/api/use-save-simulation', () => ({
  useSaveSimulation: () => ({
    isPending: false,
    isSuccess: false,
    mutate: vi.fn<() => void>(),
    reset: vi.fn<() => void>(),
  }),
}));

describe('SimulatorSubHeader', () => {
  it('결과 저장하기 버튼을 제공한다', () => {
    render(<SimulatorSubHeader />);

    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });
});
