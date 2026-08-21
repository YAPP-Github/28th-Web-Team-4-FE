import { render, screen, waitFor } from '@testing-library/react';
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

function getTooltipByText(text: string): HTMLElement {
  const tooltip = screen
    .getAllByRole('tooltip')
    .find((element) => element.textContent?.includes(text));

  if (tooltip === undefined) {
    throw new Error(`툴팁을 찾을 수 없습니다: ${text}`);
  }

  return tooltip;
}

const SIMULATION_RESULT: SimulationResponse = {
  simulationId: null,
  totalBudgetWon: 1_000_000,
  period: 'M1',
  totalEstImpressions: 38_000,
  totalEstClicks: 1_100,
  executableChannelCount: 2,
  items: [
    {
      channelId: 'channel-a',
      channelName: '채널 A',
      iconUrl: null,
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      cpcWon: null,
      cpmWon: null,
      minBudgetWon: 600_000,
      isExecutable: false,
      shortfallWon: null,
      basisNote:
        '집행 예산 부족 / 매체 소개서 기반 / VAT 별도 가정 / CTR 미제공 시 전체 평균 CTR 적용',
    },
    {
      channelId: 'channel-b',
      channelName: '채널 B',
      iconUrl: null,
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 15_000, max: 25_000 },
      estClicks: { min: 200, max: 200 },
      cpcWon: null,
      cpmWon: null,
      minBudgetWon: null,
      isExecutable: false,
      shortfallWon: null,
      basisNote:
        '노출 정보 미제공 상품 (집행 가능 여부만 판단) / 매체 소개서 기반 / VAT 별도 가정 / CTR 미제공 시 전체 평균 CTR 적용',
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
    expect(screen.getByRole('button', { name: '추천 결과 불러오기' })).toHaveAttribute(
      'href',
      '/simulator/recommendations',
    );
    expect(screen.getByRole('button', { name: '직접 선택하기' })).toHaveAttribute(
      'href',
      '/simulator/channels',
    );
  });

  it('추천 결과 불러오기 버튼을 누르면 추천 결과 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    render(<AuthenticatedChannelResults isChannelSelectionComplete={false} />);

    await user.click(screen.getByRole('button', { name: '채널 추가하기' }));

    expect(screen.getByRole('button', { name: '추천 결과 불러오기' })).toHaveAttribute(
      'href',
      '/simulator/recommendations',
    );
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

  it('basisNote에 따라 채널명 옆에 서로 다른 안내 툴팁을 제공한다', async () => {
    const user = userEvent.setup();

    render(
      <AuthenticatedChannelResults
        isChannelSelectionComplete
        selectedChannelIds={SELECTED_CHANNEL_IDS}
        simulationResult={SIMULATION_RESULT}
      />,
    );

    const budgetInfoButton = screen.getByRole('button', { name: '채널 A 기준 정보 안내' });
    const impressionInfoButton = screen.getByRole('button', { name: '채널 B 기준 정보 안내' });

    await user.hover(budgetInfoButton);
    await waitFor(() => {
      const budgetTooltip = getTooltipByText('예산이 부족해요');
      expect(budgetTooltip).toBeVisible();
      expect(budgetTooltip).toHaveTextContent('예산을 10만 원 더 추가하면');
      expect(budgetTooltip).toHaveTextContent('광고할 수 있어요');
    });

    await user.hover(impressionInfoButton);
    await waitFor(() => {
      const impressionTooltip = getTooltipByText('정보 확인이 어려워요');
      expect(impressionTooltip).toBeVisible();
      expect(impressionTooltip).toHaveTextContent('매체 특성상 상세 데이터를');
      expect(impressionTooltip).toHaveTextContent('제공하지 않아요.');
    });
  });
});
