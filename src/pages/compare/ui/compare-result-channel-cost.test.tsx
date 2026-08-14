import { render, screen, within } from '@testing-library/react';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelCost } from './compare-result-channel-cost';

describe('CompareResultChannelCost', () => {
  it('채널별 CPC와 CPM을 비교하고 가장 낮은 비용을 안내한다', () => {
    render(<CompareResultChannelCost channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    const region = screen.getByRole('region', { name: '채널별 CPC와 CPM' });

    expect(within(region).getByRole('heading', { name: 'CPC' })).toBeVisible();
    expect(within(region).getByText('클릭 1회당 드는 비용 (단위: 원)')).toBeVisible();
    expect(within(region).getByText('320')).toBeVisible();
    expect(within(region).getByText('410')).toBeVisible();
    expect(within(region).getByText('클릭당 비용이 가장 저렴해요')).toBeVisible();

    expect(within(region).getByRole('heading', { name: 'CPM' })).toBeVisible();
    expect(within(region).getByText('노출 1,000회당 드는 비용 (단위: 원)')).toBeVisible();
    expect(within(region).getByText('4,800')).toBeVisible();
    expect(within(region).getByText('3,500')).toBeVisible();
    expect(within(region).getByText('노출당 비용이 가장 저렴해요')).toBeVisible();
  });

  it('비용 정보가 없으면 대시로 표시한다', () => {
    const channels = MOCK_COMPARE_RESULT_CHANNELS.map((channel) =>
      channel.id === 'kakao' ? { ...channel, cpm: null } : channel,
    );

    render(<CompareResultChannelCost channels={channels} />);

    const region = screen.getByRole('region', { name: '채널별 CPC와 CPM' });

    expect(within(region).getByText('-')).toBeVisible();
  });
});
