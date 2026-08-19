import { render, screen } from '@testing-library/react';

import type { ChannelResult } from '@/pages/simulator/model/simulator-channel';

import { SimulatorChannelTable } from './simulator-channel-table';

const CHANNELS: readonly ChannelResult[] = [
  {
    channelId: 'naver',
    name: '네이버 검색 광고',
    budgetWon: 380_000,
    cpcWon: 580,
    unavailable: false,
    impressions: {
      value: '22,000~32,000회',
      fillPercentage: 100,
      range: { min: 22_000, max: 32_000 },
    },
    clicks: { value: '624~780회', fillPercentage: 100, range: { min: 624, max: 780 } },
  },
  {
    channelId: 'meta',
    name: '메타 광고',
    budgetWon: 0,
    cpcWon: 320,
    unavailable: true,
    impressions: { value: '-', fillPercentage: 0 },
    clicks: { value: '-', fillPercentage: 0 },
  },
];

describe('SimulatorChannelTable', () => {
  it('채널별 예산·단가·성과 범위와 운영 가능 상태를 표로 표시한다', () => {
    render(<SimulatorChannelTable channels={CHANNELS} />);

    expect(screen.getByRole('cell', { name: '38만 원' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '580원' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '624~780회' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '22,000~32,000회' })).toBeVisible();
    expect(screen.getByText('운영 가능')).toBeVisible();
    expect(screen.getByText('예산 미달')).toBeVisible();
  });
});
