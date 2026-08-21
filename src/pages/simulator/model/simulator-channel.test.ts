import type { SimulationResponse } from '@/shared/api/generated';

import {
  createChannelResults,
  formatSimulatorBudget,
  formatSimulatorCount,
  formatSimulatorCountRange,
  formatSimulatorCpc,
  formatSimulatorTableCountRange,
  getSimulatorBasisTooltip,
} from './simulator-channel';

const CHANNELS = [
  {
    id: 'channel-a',
    name: '채널 A',
    iconUrl: 'https://assets.chaeso-zip.com/icons/channel-a-default.png',
  },
  {
    id: 'channel-b',
    name: '채널 B',
    iconUrl: 'https://assets.chaeso-zip.com/icons/channel-b.png',
  },
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
      iconUrl: 'https://assets.chaeso-zip.com/icons/channel-a.png',
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 10_000, max: 20_000 },
      estClicks: { min: 300, max: 400 },
      cpcWon: 580,
      cpmWon: null,
      minBudgetWon: null,
      isExecutable: true,
      shortfallWon: null,
      basisNote: '기준 데이터',
    },
    {
      channelId: 'channel-b',
      channelName: '채널 B',
      iconUrl: null,
      channelProductId: null,
      allocatedBudgetWon: 500_000,
      allocationPct: 50,
      estImpressions: { min: 15_000, max: 25_000 },
      estClicks: { min: 200, max: 200 },
      cpcWon: 410,
      cpmWon: null,
      minBudgetWon: null,
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
        iconUrl: 'https://assets.chaeso-zip.com/icons/channel-a.png',
        impressions: { value: '1.0~2.0만 회' },
        clicks: { value: '300~400회' },
      },
      {
        name: '채널 B',
        iconUrl: 'https://assets.chaeso-zip.com/icons/channel-b.png',
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
        iconUrl: 'https://assets.chaeso-zip.com/icons/channel-a-default.png',
        impressions: { fillPercentage: 0 },
        clicks: { fillPercentage: 0 },
      },
      {
        iconUrl: 'https://assets.chaeso-zip.com/icons/channel-b.png',
        impressions: { fillPercentage: 0 },
        clicks: { fillPercentage: 0 },
      },
    ]);
  });

  it('집행 예산 부족 basisNote와 부족 금액으로 피그마 툴팁을 만든다', () => {
    expect(getSimulatorBasisTooltip('집행 예산 부족', 123_456)).toEqual({
      title: '예산이 부족해요',
      description: ['예산을 123,456원 더 추가하면', '광고할 수 있어요'],
    });

    expect(
      getSimulatorBasisTooltip('노출 정보 미제공 상품 (집행 가능 여부만 판단) 추가 안내/산출 근거'),
    ).toEqual({
      title: '정보 확인이 어려워요',
      description: ['매체 특성상 상세 데이터를', '제공하지 않아요.'],
    });

    expect(getSimulatorBasisTooltip('집행 예산 부족', undefined, false)).toEqual({
      title: '정보 확인이 어려워요',
      description: ['매체 특성상 상세 데이터를', '제공하지 않아요.'],
    });

    expect(getSimulatorBasisTooltip('기타 미집행 사유', undefined, false)).toEqual({
      title: '정보 확인이 어려워요',
      description: ['매체 특성상 상세 데이터를', '제공하지 않아요.'],
    });

    expect(getSimulatorBasisTooltip('기준 데이터')).toBeUndefined();
  });

  it('최소 집행 예산과 배분 예산의 차액을 결과에 저장한다', () => {
    const results = createChannelResults(CHANNELS, {
      ...SIMULATION_RESULT,
      items: [
        {
          ...SIMULATION_RESULT.items[0],
          allocatedBudgetWon: 500_000,
          minBudgetWon: 650_000,
          basisNote: '집행 예산 부족',
        },
        SIMULATION_RESULT.items[1],
      ],
    });

    expect(results[0]?.additionalBudgetWon).toBe(150_000);
  });
});
