import { render, screen, within } from '@testing-library/react';

import {
  MOCK_COMPARE_RESULT_CHANNELS,
  type CompareResultChannel,
} from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelCost } from './compare-result-channel-cost';

function createCostChannel(
  id: string,
  costs: { cpc: number | null; cpm: number | null },
): CompareResultChannel {
  return {
    ...MOCK_COMPARE_RESULT_CHANNELS[0],
    id,
    name: `${id} 채널`,
    ...costs,
  };
}

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

  it('비용 정보가 없으면 확인 불가를 표시한다', () => {
    const channels = MOCK_COMPARE_RESULT_CHANNELS.map((channel) =>
      channel.id === 'kakao' ? { ...channel, cpm: null } : channel,
    );

    render(<CompareResultChannelCost channels={channels} />);

    const cpmCard = screen.getByRole('region', { name: 'CPM' });

    expect(within(cpmCard).getByText('확인 불가')).toBeVisible();
    expect(within(cpmCard).getByText('카카오 키워드 광고')).toBeVisible();
  });

  it('CPC와 CPM 값을 각각 표시한다', () => {
    const channels = [
      createCostChannel('최대', { cpc: 200, cpm: 1_000 }),
      createCostChannel('비교', { cpc: 100, cpm: 250 }),
    ];

    render(<CompareResultChannelCost channels={channels} />);

    const cpcCard = screen.getByRole('region', { name: 'CPC' });
    const cpmCard = screen.getByRole('region', { name: 'CPM' });

    expect(within(cpcCard).getByText('200')).toBeVisible();
    expect(within(cpcCard).getByText('100')).toBeVisible();
    expect(within(cpmCard).getByText('1,000')).toBeVisible();
    expect(within(cpmCard).getByText('250')).toBeVisible();
  });

  it('최저 비용이 같은 채널은 툴팁을 숨긴다', () => {
    const channels = [
      createCostChannel('동률-A', { cpc: 100, cpm: 1_000 }),
      createCostChannel('동률-B', { cpc: 100, cpm: 2_000 }),
      createCostChannel('비교', { cpc: 200, cpm: 1_000 }),
    ];

    render(<CompareResultChannelCost channels={channels} />);

    expect(screen.queryByText('클릭당 비용이 가장 저렴해요')).not.toBeInTheDocument();
    expect(screen.queryByText('노출당 비용이 가장 저렴해요')).not.toBeInTheDocument();
  });

  it('모든 비용이 null이어도 CPC와 CPM 카드를 유지한다', () => {
    const channels = [
      createCostChannel('채널-A', { cpc: null, cpm: null }),
      createCostChannel('채널-B', { cpc: null, cpm: null }),
    ];

    render(<CompareResultChannelCost channels={channels} />);

    const cpcCard = screen.getByRole('region', { name: 'CPC' });
    const cpmCard = screen.getByRole('region', { name: 'CPM' });

    expect(within(cpcCard).getAllByText('확인 불가')).toHaveLength(2);
    expect(within(cpmCard).getAllByText('확인 불가')).toHaveLength(2);
    expect(screen.queryByText(/비용이 가장 저렴해요/)).not.toBeInTheDocument();
  });
});
