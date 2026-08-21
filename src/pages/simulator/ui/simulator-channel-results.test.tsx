import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SimulatorChannelResults } from './simulator-channel-results';

vi.mock('@/features/simulator-filter/api/use-simulator-filter-channels', () => ({
  useSimulatorFilterChannels: () => ({
    channels: [
      { id: 'channel-a', name: '채널 A' },
      {
        id: 'channel-b',
        name: '채널 B',
        cost: { pricingModel: 'CPC', value: 580, valueMax: null },
      },
      {
        id: 'channel-c',
        name: '채널 C',
        cost: { pricingModel: 'CPM', value: 3500, valueMax: null },
      },
    ],
    isPending: false,
    isError: false,
  }),
}));

describe('SimulatorChannelResults', () => {
  it('선택한 채널 ID를 결과 섹션에 전달한다', () => {
    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        loginHref="/login"
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    expect(screen.getByRole('region', { name: '채널별 예상 노출 · 클릭 수' })).toHaveAttribute(
      'data-selected-channel-ids',
      'channel-a,channel-b,channel-c',
    );

    expect(document.querySelector('[data-view-icon="graph"]')).toHaveClass('text-icon-default');
    expect(document.querySelector('[data-view-icon="graph"]')).toHaveClass('size-[13px]');
    expect(document.querySelector('[data-view-icon="table"]')).toHaveClass('text-icon-low');
  });

  it('표로 보기 버튼을 누르면 채널별 결과 표를 보여준다', async () => {
    const user = userEvent.setup();

    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        loginHref="/login"
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    await user.click(screen.getByRole('button', { name: '표로 보기' }));

    expect(screen.getByRole('button', { name: '표로 보기' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(document.querySelector('[data-view-icon="graph"]')).toHaveClass('text-icon-low');
    expect(document.querySelector('[data-view-icon="table"]')).toHaveClass('text-icon-default');
    expect(screen.getByRole('heading', { name: '채널별 예상 성과' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '클릭당 비용' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '운영 가능 여부' })).toBeVisible();
  });

  it('채널 선택 후 API 단가를 툴팁에 보여준다', async () => {
    const user = userEvent.setup();

    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        loginHref="/login"
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    await user.hover(screen.getByRole('button', { name: '채널별 클릭당 비용 안내' }));

    await waitFor(() => {
      expect(screen.getByText('채널 B 580원')).toBeVisible();
      expect(screen.getByText('채널 C 노출 1,000회 당 약 3,500원')).toBeVisible();
    });
  });

  it('채널 선택 전에는 단가 툴팁을 열 수 없다', () => {
    render(<SimulatorChannelResults isLogin loginHref="/login" />);

    expect(
      screen.queryByRole('button', { name: '채널별 클릭당 비용 안내' }),
    ).not.toBeInTheDocument();
  });

  it('비로그인 로그인 링크가 현재 시뮬레이터 결과 주소를 보존한다', () => {
    render(
      <SimulatorChannelResults
        isLogin={false}
        loginHref="/login?returnTo=%2Fsimulator%3FchannelIds%3Dchannel-a%26filterOpen%3Dtrue"
      />,
    );

    expect(screen.getByRole('link', { name: '로그인하기' })).toHaveAttribute(
      'href',
      '/login?returnTo=%2Fsimulator%3FchannelIds%3Dchannel-a%26filterOpen%3Dtrue',
    );
  });
});
