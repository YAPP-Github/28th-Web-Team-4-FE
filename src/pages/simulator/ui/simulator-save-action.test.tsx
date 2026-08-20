import type { ComponentProps, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SimulationResponse } from '@/shared/api/generated';

import { SimulatorSaveAction } from './simulator-save-action';

type SaveSimulationCallbacks = {
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
};

const { mutateMock, resetMock, showToastMock, mutationState } = vi.hoisted(() => ({
  mutateMock: vi.fn<(options: unknown, callbacks?: SaveSimulationCallbacks) => void>(),
  resetMock: vi.fn<() => void>(),
  showToastMock: vi.fn<(options: unknown) => void>(),
  mutationState: {
    isPending: false,
    isSuccess: false,
  },
}));

vi.mock('@/pages/simulator/api/use-save-simulation', () => ({
  useSaveSimulation: () => ({
    ...mutationState,
    mutate: mutateMock,
    reset: resetMock,
  }),
}));

vi.mock('@/shared/ui/toast', () => ({
  showToast: showToastMock,
  showWarningToast: vi.fn<(description: string, options?: unknown) => void>(),
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    span: ({
      animate: _animate,
      children,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      ...props
    }: ComponentProps<'span'> & {
      animate?: unknown;
      exit?: unknown;
      initial?: unknown;
      transition?: unknown;
    }) => <span {...props}>{children}</span>,
  },
  useReducedMotion: () => false,
}));

const SIMULATION_RESULT: SimulationResponse = {
  simulationId: null,
  totalBudgetWon: 1_000_000,
  period: 'M1',
  totalEstImpressions: 38_000,
  totalEstClicks: 1_100,
  executableChannelCount: 1,
  items: [
    {
      channelId: 'channel-a',
      channelName: '채널 A',
      iconUrl: null,
      channelProductId: 'product-a',
      allocatedBudgetWon: 500_000,
      allocationPct: null,
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      cpcWon: 580,
      cpmWon: null,
      minBudgetWon: null,
      isExecutable: true,
      shortfallWon: null,
      basisNote: '기준 데이터',
    },
  ],
};

describe('SimulatorSaveAction', () => {
  beforeEach(() => {
    mutateMock.mockReset();
    resetMock.mockReset();
    showToastMock.mockReset();
    mutationState.isPending = false;
    mutationState.isSuccess = false;
  });

  it('시뮬레이션 결과가 없으면 저장 버튼을 비활성화한다', () => {
    render(<SimulatorSaveAction />);

    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeDisabled();
  });

  it('시뮬레이션 결과를 저장 API 요청으로 변환한다', async () => {
    const user = userEvent.setup();

    render(<SimulatorSaveAction simulationResult={SIMULATION_RESULT} />);

    await user.click(screen.getByRole('button', { name: '결과 저장하기' }));
    await user.type(screen.getByRole('textbox', { name: '서비스명' }), '채소집');
    await user.click(screen.getByRole('button', { name: /^저장하기$/ }));

    expect(mutateMock).toHaveBeenCalledWith(
      {
        body: {
          serviceName: '채소집',
          totalBudgetWon: 1_000_000,
          period: 'M1',
          allocations: [
            {
              channelId: 'channel-a',
              budgetWon: 500_000,
              allocationPct: 0,
            },
          ],
        },
      },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
  });

  it('저장 성공 시 마이페이지 저장 완료 토스트를 보여준다', async () => {
    const user = userEvent.setup();

    render(<SimulatorSaveAction simulationResult={SIMULATION_RESULT} />);

    await user.click(screen.getByRole('button', { name: '결과 저장하기' }));
    await user.type(screen.getByRole('textbox', { name: '서비스명' }), '채소집');
    await user.click(screen.getByRole('button', { name: /^저장하기$/ }));
    mutateMock.mock.calls[0]?.[1]?.onSuccess?.();

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'simulator-save-success',
      description: '마이페이지에 결과를 저장했어요',
      type: 'success',
    });
  });

  it('결과 저장하기를 누르면 서비스명 입력 모달을 연다', async () => {
    const user = userEvent.setup();

    render(<SimulatorSaveAction simulationResult={SIMULATION_RESULT} />);

    await user.click(screen.getByRole('button', { name: '결과 저장하기' }));

    expect(screen.getByRole('heading', { name: '어떤 이름으로 결과를 저장할까요?' })).toBeVisible();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it('서비스명 입력 모달에서 취소하면 저장하지 않는다', async () => {
    const user = userEvent.setup();

    render(<SimulatorSaveAction simulationResult={SIMULATION_RESULT} />);

    await user.click(screen.getByRole('button', { name: '결과 저장하기' }));
    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(
      screen.queryByRole('heading', { name: '어떤 이름으로 결과를 저장할까요?' }),
    ).not.toBeInTheDocument();
    expect(mutateMock).not.toHaveBeenCalled();
  });
});
