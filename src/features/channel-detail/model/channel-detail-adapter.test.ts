import type { ChannelDetailResponse } from '@/shared/api/generated';

import { toChannelDetailViewModel } from './channel-detail-adapter';

type ChannelDetailApiModel = NonNullable<ChannelDetailResponse>;

function createChannelDetail(
  overrides: Partial<ChannelDetailApiModel> = {},
): ChannelDetailApiModel {
  return {
    id: 'channel-meta',
    name: '메타 광고',
    logoUrl: ' https://cdn.example.com/meta.png ',
    description: ' 정교한 관심사 타기팅을 제공해요. ',
    primaryCategory: 'SHOPPING_COMMERCE',
    primaryAgeBand: ' 20~40대 ',
    primaryGender: 'FEMALE',
    audienceTraits: ' 구매 의도가 높은 사용자 ',
    advantages: [' 높은 전환 효율 ', '다양한 크리에이티브 포맷'],
    products: [
      {
        id: 'product-feed',
        productName: ' 피드 광고 ',
        minBudgetWon: 200_000,
        maxBudgetWon: 500_000,
        ctr: 1.2,
        expectedImpressions: 150_000,
        expectedPeriod: '1주',
        pricing: [],
      },
      {
        id: 'product-story',
        inventoryType: '스토리',
        minBudgetWon: 300_000,
        ctrMin: 0.5,
        ctrMax: 0.9,
        pricing: [],
      },
    ],
    audienceMetrics: [
      {
        metricName: '월간 사용자',
        valueNumeric: 160_000,
        unit: '명',
        period: '최근 30일',
      },
      {
        metricName: '일 활성 사용자',
        valueNumeric: 12_000,
        valueText: ' 약 1.2만 명 ',
        unit: '명',
      },
    ],
    references: ['브랜드 캠페인 A', '전환 캠페인 B'],
    ...overrides,
  };
}

describe('toChannelDetailViewModel', () => {
  it('상세 응답의 설명, 상품, 오디언스 지표와 집행 사례를 표시 모델로 변환한다', () => {
    const result = toChannelDetailViewModel(createChannelDetail());

    expect(result).toMatchObject({
      id: 'channel-meta',
      name: '메타 광고',
      logoUrl: 'https://cdn.example.com/meta.png',
      tagline: '정교한 관심사 타기팅을 제공해요.',
      summary: {
        paragraphs: [
          '정교한 관심사 타기팅을 제공해요.',
          '높은 전환 효율',
          '다양한 크리에이티브 포맷',
        ],
      },
      audience: {
        primaryAgeBand: '20~40대',
        primaryGender: '여성',
        traits: '구매 의도가 높은 사용자',
        metrics: [
          { label: '월간 사용자 (최근 30일)', value: '160,000명' },
          { label: '일 활성 사용자', value: '약 1.2만 명' },
        ],
      },
      similarCases: ['브랜드 캠페인 A', '전환 캠페인 B'],
    });
    expect(result.products).toEqual([
      {
        id: 'product-feed',
        name: '피드 광고',
        budgetRange: '20만 원~50만 원',
        expectedImpressions: '150,000회 / 1주',
        ctr: '1.2%',
      },
      {
        id: 'product-story',
        name: '스토리',
        budgetRange: '30만 원 이상',
        expectedImpressions: '-',
        ctr: '0.5~0.9%',
      },
    ]);
  });

  it('선택 필드가 누락되면 화면에서 사용할 기본 표시값으로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        logoUrl: undefined,
        description: undefined,
        primaryAgeBand: undefined,
        primaryGender: undefined,
        audienceSummary: undefined,
        audienceTraits: undefined,
        advantages: undefined,
        products: [{ id: 'product-unknown', pricing: [] }],
        audienceMetrics: [{ metricName: '구독자', valueNumeric: null }],
      }),
    );

    expect(result.logoUrl).toBe('');
    expect(result.tagline).toBe('');
    expect(result.summary.paragraphs).toEqual([]);
    expect(result.products).toEqual([
      {
        id: 'product-unknown',
        name: '상품명 미제공',
        budgetRange: '-',
        expectedImpressions: '-',
        ctr: null,
      },
    ]);
    expect(result.audience).toEqual({
      primaryAgeBand: '-',
      primaryGender: '-',
      traits: '-',
      metrics: [{ label: '구독자', value: '-' }],
    });
  });

  it('상품, 지표와 집행 사례의 빈 배열을 유지한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({ products: [], audienceMetrics: [], references: [] }),
    );

    expect(result.products).toEqual([]);
    expect(result.audience.metrics).toEqual([]);
    expect(result.similarCases).toEqual([]);
  });
});
