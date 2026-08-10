import type { SimulationResponse } from '@/shared/api/generated';

import { createChannelResults, formatSimulatorCountRange } from './simulator-channel';

const CHANNELS = [
  { id: 'channel-a', name: '채널 A' },
  { id: 'channel-b', name: '채널 B' },
] as const;

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
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      isExecutable: true,
      basisNote: '기준 데이터',
    },
    {
      channelId: 'channel-b',
      channelName: '채널 B',
      allocatedBudgetWon: 500_000,
      estImpressions: { min: 15_000, max: 25_000 },
      estClicks: { min: 200, max: 200 },
      isExecutable: true,
      basisNote: '기준 데이터',
    },
  ],
};

describe('simulator-channel', () => {
  it('응답 범위를 한국어 횟수 표기로 변환한다', () => {
    expect(formatSimulatorCountRange({ min: 22_000, max: 32_000 })).toBe('22,000~32,000회');
    expect(formatSimulatorCountRange({ min: 780, max: 780 })).toBe('780회');
  });

  it('노출수 중앙값을 공통 기준으로 노출·클릭 바 비율을 계산한다', () => {
    const results = createChannelResults(CHANNELS, SIMULATION_RESULT);

    expect(results).toMatchObject([
      {
        name: '채널 A',
        impressions: { value: '10,000~20,000회' },
        clicks: { value: '300~400회' },
      },
      {
        name: '채널 B',
        impressions: { value: '15,000~25,000회', fillPercentage: 100 },
        clicks: { value: '200회' },
      },
    ]);

    expect(results[0]?.impressions.fillPercentage).toBeCloseTo(86.6, 1);
    expect(results[0]?.clicks.fillPercentage).toBeCloseTo(13.2, 1);
    expect(results[1]?.clicks.fillPercentage).toBeCloseTo(10, 1);
  });
});
