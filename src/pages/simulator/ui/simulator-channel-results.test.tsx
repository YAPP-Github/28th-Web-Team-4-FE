import { render, screen, waitFor } from '@testing-library/react';
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

  it('채널별 예상 노출·클릭 수 옆에 클릭당 비용 안내 툴팁을 보여준다', async () => {
    const user = userEvent.setup();

    render(
      <SimulatorChannelResults
        isLogin
        isChannelSelectionComplete
        selectedChannelIds={['channel-a', 'channel-b', 'channel-c']}
      />,
    );

    const infoButton = screen.getByRole('button', { name: '채널별 클릭당 비용 안내' });

    expect(infoButton).toBeVisible();
    await user.hover(infoButton);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeVisible();
      expect(tooltip).toHaveTextContent('채널별 클릭당 비용');
    });
  });
});
