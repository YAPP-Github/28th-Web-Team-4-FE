import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SimulationResponse } from '@/shared/api/generated';

import { AuthenticatedChannelResults } from './simulator-authenticated-results';

type SimulatorFilterChannelsResult = {
  channels: { id: string; name: string }[];
  isPending: boolean;
  isError: boolean;
};

const useSimulatorFilterChannelsMock = vi.hoisted(() =>
  vi.fn<() => SimulatorFilterChannelsResult>(),
);

vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number }) => (
    <span>{new Intl.NumberFormat('ko-KR').format(value)}</span>
  ),
}));

const SELECTED_CHANNEL_IDS = ['channel-a', 'channel-b', 'channel-c'] as const;

const SIMULATION_RESULT: SimulationResponse = {
  totalBudgetWon: 1_000_000,
  period: 'M1',
  totalEstImpressions: 38_000,
  totalEstClicks: 1_100,
  executableChannelCount: 2,
  items: [
    {
      channelId: 'channel-a',
      channelName: '채널 A',
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      isExecutable: true,
      basisNote: '기준 데이터',
    },
    {
      channelId: 'channel-b',
      channelName: '채널 B',
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 15_000, max: 25_000 },
      estClicks: { min: 200, max: 200 },
      isExecutable: true,
      basisNote: '기준 데이터',
    },
  ],
};

vi.mock('@/features/simulator-filter/api/use-simulator-filter-channels', () => ({
  useSimulatorFilterChannels: useSimulatorFilterChannelsMock,
}));

beforeEach(() => {
  useSimulatorFilterChannelsMock.mockReturnValue({
    channels: [
      { id: 'channel-a', name: '채널 A' },
      { id: 'channel-b', name: '채널 B' },
      { id: 'channel-c', name: '채널 C' },
    ],
    isPending: false,
    isError: false,
  });
});

describe('AuthenticatedChannelResults', () => {
  it('채널 미선택 상태에서 채널 추가 방식을 선택하는 모달을 제공한다', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    const addChannelButton = screen.getByRole('button', { name: '채널 추가하기' });
    expect(addChannelButton).not.toHaveAttribute('href');

    await user.click(addChannelButton);

    expect(screen.getByRole('dialog', { name: '어떤 방식으로 추가할까요?' })).toBeVisible();
    expect(screen.getByRole('button', { name: '추천 결과 불러오기' })).not.toHaveAttribute('href');
    expect(screen.getByRole('button', { name: '직접 선택하기' })).toHaveAttribute(
      'href',
      '/simulator/channels',
    );
  });

  it('추천 결과 불러오기 버튼을 눌러도 모달을 유지한다', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    await user.click(screen.getByRole('button', { name: '채널 추가하기' }));
    await user.click(screen.getByRole('button', { name: '추천 결과 불러오기' }));

    expect(screen.getByRole('dialog', { name: '어떤 방식으로 추가할까요?' })).toBeVisible();
  });

  it('선택 완료 상태에서는 채널 추가 링크를 보여주지 않는다', () => {
    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
      />,
    );

    expect(screen.queryByRole('button', { name: '채널 추가하기' })).not.toBeInTheDocument();
  });

  it('선택한 채널을 불러오는 동안 스켈레톤을 보여준다', () => {
    useSimulatorFilterChannelsMock.mockReturnValue({
      channels: [],
      isPending: true,
      isError: false,
    });

    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
      />,
    );

    expect(
      screen.getByRole('status', { name: '선택한 채널 정보를 불러오는 중이에요' }),
    ).toBeVisible();
    expect(screen.getAllByTestId('simulator-channel-skeleton')).toHaveLength(3);
  });

  it('선택된 채널을 0 지표의 초기 결과 목록으로 보여준다', () => {
    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
      />,
    );

    expect(screen.getByText('채널 A')).toBeVisible();
    expect(screen.getByText('채널 B')).toBeVisible();
    expect(screen.getByText('채널 C')).toBeVisible();
  });

  it('시뮬레이션 응답의 채널별 노출·클릭 범위와 횟수를 보여준다', () => {
    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
        simulationResult={SIMULATION_RESULT}
      />,
    );

    expect(screen.getByText('1.0~2.0만 회')).toBeVisible();
    expect(screen.getByText('300~400회')).toBeVisible();
    expect(screen.getByText('1.5~2.5만 회')).toBeVisible();
    expect(screen.getByText('200회')).toBeVisible();
  });
});
