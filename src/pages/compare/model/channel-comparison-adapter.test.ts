import type { ChannelComparisonItemResponse } from '@/shared/api/generated';

import { mapChannelComparisonItemsToChannels } from './channel-comparison-adapter';

function createComparisonItem(
  overrides: Partial<ChannelComparisonItemResponse> = {},
): ChannelComparisonItemResponse {
  return {
    channelId: 'channel-naver',
    channelName: '네이버 검색 광고',
    iconUrl: null,
    audienceSummary: '20~40대 여성',
    adFormats: ['배너', '피드', '릴스'],
    targetingMethods: ['관심사', '행동'],
    minBudgetWon: 200_000,
    advantages: ['구매 의도가 높은 고객에게 도달해요.'],
    tags: ['KPI 최적', '입문자 추천'],
    cpcWon: 320,
    cpmWon: 4_800,
    matchRate: 95,
    estImpressions: { min: 120_000, max: 180_000 },
    estClicks: { min: 1_800, max: 2_700 },
    ...overrides,
  };
}

describe('mapChannelComparisonItemsToChannels', () => {
  it('API 응답의 전체 필드를 화면 모델과 표시 형식으로 변환한다', () => {
    const [channel] = mapChannelComparisonItemsToChannels([createComparisonItem()]);

    expect(channel).toEqual({
      id: 'channel-naver',
      name: '네이버 검색 광고',
      matchRate: 95,
      logoSrc: '/compare-assets/naver.png',
      cropIcon: true,
      impressions: {
        value: '120,000~180,000회',
        fillPercentage: 100,
        available: true,
      },
      clicks: {
        value: '1,800~2,700회',
        fillPercentage: 100,
        available: true,
      },
      details: {
        minimumBudget: '200,000원',
        primaryAudience: '20~40대 여성',
        adFormats: '배너 · 피드 · 릴스',
        targetingMethods: '관심사 · 행동',
      },
      cpc: 320,
      cpm: 4_800,
      insight: {
        keyword: ['KPI 최적', '입문자 추천'],
        advantages: ['구매 의도가 높은 고객에게 도달해요.'],
      },
    });
  });

  it('상세 정보의 null과 빈 배열은 정보 없음으로 변환하고 지표 null은 보존한다', () => {
    const [channel] = mapChannelComparisonItemsToChannels([
      createComparisonItem({
        channelId: 'unknown-channel',
        channelName: '새로운 채널',
        audienceSummary: null,
        adFormats: [],
        targetingMethods: [],
        minBudgetWon: null,
        advantages: [],
        tags: [],
        cpcWon: null,
        cpmWon: null,
        matchRate: null,
        estImpressions: null,
        estClicks: null,
      }),
    ]);

    expect(channel).toMatchObject({
      id: 'unknown-channel',
      matchRate: null,
      logoSrc: null,
      impressions: {
        value: '확인 불가',
        fillPercentage: 0,
        available: false,
      },
      clicks: {
        value: '확인 불가',
        fillPercentage: 0,
        available: false,
      },
      details: {
        minimumBudget: '정보 없음',
        primaryAudience: '정보 없음',
        adFormats: '정보 없음',
        targetingMethods: '정보 없음',
      },
      cpc: null,
      cpm: null,
      insight: {
        keyword: ['정보 없음'],
        advantages: ['정보 없음'],
      },
    });
  });

  it('성과별 유효 대표값을 독립적으로 정규화하고 확인 불가 항목을 제외한다', () => {
    const channels = mapChannelComparisonItemsToChannels([
      createComparisonItem({
        channelId: 'channel-a',
        estImpressions: { min: 10_000, max: 20_000 },
        estClicks: null,
      }),
      createComparisonItem({
        channelId: 'channel-b',
        estImpressions: { min: 20_000, max: 40_000 },
        estClicks: { min: 100, max: 300 },
      }),
      createComparisonItem({
        channelId: 'channel-c',
        estImpressions: null,
        estClicks: { min: 200, max: 600 },
      }),
    ]);

    expect(channels.map(({ impressions }) => impressions.fillPercentage)).toEqual([50, 100, 0]);
    expect(channels.map(({ clicks }) => clicks.fillPercentage)).toEqual([0, 50, 100]);
  });

  it('API 응답 순서를 그대로 유지한다', () => {
    const channels = mapChannelComparisonItemsToChannels([
      createComparisonItem({ channelId: 'channel-c' }),
      createComparisonItem({ channelId: 'channel-a' }),
      createComparisonItem({ channelId: 'channel-b' }),
    ]);

    expect(channels.map(({ id }) => id)).toEqual(['channel-c', 'channel-a', 'channel-b']);
  });

  it('저장된 결과가 제공한 미리보기 로고를 우선 사용한다', () => {
    const [channel] = mapChannelComparisonItemsToChannels([
      createComparisonItem({ iconUrl: 'https://cdn.example.com/naver.png' }),
    ]);

    expect(channel.logoSrc).toBe('https://cdn.example.com/naver.png');
    expect(channel.cropIcon).toBe(false);
  });
});
