import type { SimulationResponse } from '@/shared/api/generated';

import {
  createChannelResults,
  formatSimulatorBudget,
  formatSimulatorCount,
  formatSimulatorCountRange,
  formatSimulatorCpc,
  formatSimulatorTableCountRange,
} from './simulator-channel';

const CHANNELS = [
  { id: 'channel-a', name: '채널 A' },
  { id: 'channel-b', name: '채널 B' },
] as const;

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
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      cpcWon: 580,
      cpmWon: null,
      isExecutable: true,
      shortfallWon: null,
      basisNote: '기준 데이터',
    },
    {
      channelId: 'channel-b',
      channelName: '채널 B',
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 15_000, max: 25_000 },
      estClicks: { min: 200, max: 200 },
      cpcWon: 410,
      cpmWon: null,
      isExecutable: true,
      shortfallWon: null,
      basisNote: '기준 데이터',
    },
  ],
};

describe('simulator-channel', () => {
  it('응답 범위를 한국어 횟수 표기로 변환한다', () => {
    expect(formatSimulatorCount(10_000)).toBe('1.0만 회');
    expect(formatSimulatorCount(9_999)).toBe('9,999회');
    expect(formatSimulatorCountRange({ min: 22_000, max: 32_000 })).toBe('2.2~3.2만 회');
    expect(formatSimulatorCountRange({ min: 780, max: 780 })).toBe('780회');
  });

  it('표에 맞는 원 단위와 전체 횟수 표기를 제공한다', () => {
    expect(formatSimulatorBudget(380_000)).toBe('38만 원');
    expect(formatSimulatorBudget(380_500)).toBe('380,500원');
    expect(formatSimulatorCpc(580)).toBe('580원');
    expect(formatSimulatorCpc(null)).toBe('-');
    expect(formatSimulatorTableCountRange({ min: 22_000, max: 32_000 })).toBe('22,000~32,000회');
    expect(formatSimulatorTableCountRange()).toBe('-');
  });

  it('노출수 중앙값을 공통 기준으로 노출·클릭 바 비율을 계산한다', () => {
    const results = createChannelResults(CHANNELS, SIMULATION_RESULT);

    expect(results).toMatchObject([
      {
        name: '채널 A',
        impressions: { value: '1.0~2.0만 회' },
        clicks: { value: '300~400회' },
      },
      {
        name: '채널 B',
        impressions: { value: '1.5~2.5만 회', fillPercentage: 100 },
        clicks: { value: '200회' },
      },
    ]);

    expect(results[0]?.impressions.fillPercentage).toBeCloseTo(86.6, 1);
    expect(results[0]?.clicks.fillPercentage).toBeCloseTo(13.2, 1);
    expect(results[1]?.clicks.fillPercentage).toBeCloseTo(10, 1);
  });

  it('시뮬레이션 전 채널의 노출·클릭 바를 빈 상태로 만든다', () => {
    const results = createChannelResults(CHANNELS);

    expect(results).toMatchObject([
      {
        impressions: { fillPercentage: 0 },
        clicks: { fillPercentage: 0 },
      },
      {
        impressions: { fillPercentage: 0 },
        clicks: { fillPercentage: 0 },
      },
    ]);
  });
});
