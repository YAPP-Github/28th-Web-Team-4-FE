import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SimulatorChannelResults } from './simulator-channel-results';

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

describe('SimulatorChannelResults', () => {
  it('선택한 채널 ID를 결과 섹션에 전달한다', () => {
    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    expect(screen.getByRole('region', { name: '채널별 예상 노출 · 클릭 수' })).toHaveAttribute(
      'data-selected-channel-ids',
      'channel-a,channel-b,channel-c',
    );
  });

  it('표로 보기 버튼을 누르면 채널별 결과 표를 보여준다', async () => {
    const user = userEvent.setup();

    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    await user.click(screen.getByRole('button', { name: '표로 보기' }));

    expect(screen.getByRole('button', { name: '표로 보기' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('heading', { name: '채널별 예상 성과' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '클릭당 비용' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '운영 가능 여부' })).toBeVisible();
  });
});
