import { render, screen } from '@testing-library/react';

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
});
