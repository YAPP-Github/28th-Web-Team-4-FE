import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { SimulationResponse } from '@/shared/api/generated';

import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';

const SELECTED_CHANNEL_IDS = ['channel-a', 'channel-b', 'channel-c'] as const;
const onSimulationResultMock = vi.fn<(result: SimulationResponse) => void>();
const estimateMutationFnMock = vi.hoisted(() => vi.fn<(options: unknown) => Promise<unknown>>());

vi.mock('@/features/simulator-filter/api/use-simulator-filter-channels', () => ({
  useSimulatorFilterChannels: () => ({
    channels: [
      { id: 'channel-a', name: '채널 A' },
      { id: 'channel-b', name: '채널 B' },
      { id: 'channel-c', name: '채널 C' },
    ],
    isPending: false,
    isError: false,
  }),
}));

vi.mock('@/shared/api/generated/@tanstack/react-query.gen', () => ({
  estimateSimulationMutation: () => ({ mutationFn: estimateMutationFnMock }),
}));

function renderSimulatorChannelSelectionButton() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <SimulatorChannelSelectionButton
        selectedChannelIds={SELECTED_CHANNEL_IDS}
        onSimulationResult={onSimulationResultMock}
      />
    </QueryClientProvider>,
  );
}

describe('SimulatorChannelSelectionButton', () => {
  beforeEach(() => {
    onSimulationResultMock.mockReset();
    estimateMutationFnMock.mockReset();
    estimateMutationFnMock.mockResolvedValue({
      data: {
        totalBudgetWon: 100_000,
        period: 'W2_3',
        totalEstImpressions: 0,
        totalEstClicks: 0,
        executableChannelCount: 0,
        items: [],
      },
    });
  });

  it('필터 조정 버튼을 고정 버튼으로 제공한다', () => {
    renderSimulatorChannelSelectionButton();

    const button = screen.getByRole('button', { name: '필터 조정하기' });

    expect(button).toHaveClass('motion-safe:animate-simulator-channel-selection-enter');
  });

  it('필터 조정 버튼을 누르면 좌측 필터 패널을 연다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    expect(await screen.findByRole('dialog', { name: '필터' })).toBeVisible();
    expect(screen.getByText('총 광고 예산')).toBeVisible();
    expect(screen.getByText('매체별 예산 배분')).toBeVisible();
  });

  it('필터 패널의 닫기 버튼을 누르면 패널을 닫는다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    expect(await screen.findByRole('dialog', { name: '필터' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '필터 닫기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '필터' })).not.toBeInTheDocument();
    });
  });

  it('총 광고 예산 슬라이더를 조작하면 예산 표시를 갱신한다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const slider = await screen.findByRole('slider', { name: '총 광고 예산 슬라이더' });
    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuetext', '20만 원');
    expect(screen.getByText('20만 원')).toBeVisible();
  });

  it('광고 집행 기간을 선택하면 선택 상태와 적용하기 버튼을 보여준다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    await user.click(screen.getByRole('button', { name: '2~3주' }));

    expect(screen.getByRole('button', { name: '2~3주' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '적용하기' })).toBeVisible();
    expect(screen.getByText('0.5만 원')).toBeVisible();
  });

  it('채널별 예산을 모두 사용하면 남은 채널 슬라이더를 비활성화한다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const naverSlider = await screen.findByRole('slider', {
      name: '채널 A 예산 슬라이더',
    });
    naverSlider.focus();
    await user.keyboard('{End}');

    const newscashSlider = screen.getByRole('slider', { name: '채널 B 예산 슬라이더' });

    expect(naverSlider).toHaveAttribute('aria-valuetext', '10만 원');
    expect(newscashSlider).toBeDisabled();
  });

  it('필터를 변경하지 않으면 적용하기 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    expect(await screen.findByRole('button', { name: '적용하기' })).toBeDisabled();
  });

  it('초기화 버튼을 누르면 모든 필터를 최초 상태로 되돌린다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const slider = await screen.findByRole('slider', { name: '총 광고 예산 슬라이더' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(slider).toHaveAttribute('aria-valuetext', '10만 원');
    expect(screen.getByRole('button', { name: '2~3주' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '적용하기' })).toBeDisabled();
  });

  it('적용하기를 누르면 필터 패널을 닫는다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '적용하기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '필터' })).not.toBeInTheDocument();
    });
    expect(onSimulationResultMock).toHaveBeenCalledWith(
      expect.objectContaining({ totalBudgetWon: 100_000 }),
    );
  });

  it('적용하기를 누르면 선택 채널과 필터 값을 API 요청으로 변환한다', async () => {
    const user = userEvent.setup();
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    const totalBudgetSlider = await screen.findByRole('slider', { name: '총 광고 예산 슬라이더' });
    totalBudgetSlider.focus();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '적용하기' }));

    await waitFor(() => expect(estimateMutationFnMock).toHaveBeenCalled());

    expect(estimateMutationFnMock.mock.calls[0]?.[0]).toEqual({
      body: {
        totalBudgetWon: 200_000,
        period: 'W2_3',
        allocations: [
          { channelId: 'channel-a', budgetWon: 0, allocationPct: 0 },
          { channelId: 'channel-b', budgetWon: 0, allocationPct: 0 },
          { channelId: 'channel-c', budgetWon: 0, allocationPct: 0 },
        ],
      },
    });
  });

  it('API 요청이 실패하면 필터 패널을 유지하고 오류를 보여준다', async () => {
    const user = userEvent.setup();
    estimateMutationFnMock.mockRejectedValueOnce(new Error('request failed'));
    renderSimulatorChannelSelectionButton();

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '적용하기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '시뮬레이션 결과를 불러오지 못했어요',
    );
    expect(screen.getByRole('dialog', { name: '필터' })).toBeVisible();
  });
});
