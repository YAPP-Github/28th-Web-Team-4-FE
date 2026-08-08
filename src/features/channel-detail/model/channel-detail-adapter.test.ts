import type { ChannelDetailResponse } from '@/shared/api/generated';

import { toChannelDetailViewModel } from './channel-detail-adapter';

type ChannelDetailApiModel = NonNullable<ChannelDetailResponse>;
type ChannelDetailFixture = Omit<ChannelDetailApiModel, 'primaryGender' | 'audienceTraits'> & {
  primaryGender?: ChannelDetailApiModel['primaryGender'] | null;
  audienceTraits?: string | null;
};

function createChannelDetail(overrides: Partial<ChannelDetailFixture> = {}): ChannelDetailFixture {
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
        metricName: 'MAU',
        valueNumeric: 160_000,
        valueText: '16만 명',
        unit: '명',
        period: '최근 30일',
      },
      {
        metricName: 'DAU',
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
        paragraphs: ['정교한 관심사 타기팅을 제공해요.'],
      },
      audience: {
        primaryAgeBand: '20~40대',
        primaryGender: '여성',
        userScale: '16만 명',
        dailyActiveUsers: '약 1.2만 명',
        traits: '구매 의도가 높은 사용자',
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
        audienceSummary: '짧은 오디언스 요약은 유저 특성으로 쓰지 않는다',
        audienceTraits: undefined,
        advantages: undefined,
        products: [{ id: 'product-unknown', pricing: [] }],
        audienceMetrics: [],
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
      userScale: '-',
      dailyActiveUsers: '-',
      traits: '-',
    });
  });

  it('상품의 예산·CTR·노출이 null이면 0이 아니라 기본 표시값으로 변환한다', () => {
    // 실 API는 값 없음을 undefined가 아니라 null로 내려준다.
    const nullProduct = {
      id: 'product-null',
      productName: '집행 정보 미제공 상품',
      minBudgetWon: null,
      maxBudgetWon: null,
      ctr: null,
      ctrMin: null,
      ctrMax: null,
      expectedImpressions: null,
      pricing: [],
    } as unknown as ChannelDetailApiModel['products'][number];

    const result = toChannelDetailViewModel(createChannelDetail({ products: [nullProduct] }));

    expect(result.products).toEqual([
      {
        id: 'product-null',
        name: '집행 정보 미제공 상품',
        budgetRange: '-',
        expectedImpressions: '-',
        ctr: null,
      },
    ]);
  });

  it('대표 성별이 null이면 -로 표시한다', () => {
    const result = toChannelDetailViewModel(createChannelDetail({ primaryGender: null }));

    expect(result.audience.primaryGender).toBe('-');
  });

  it('MAU와 DAU의 valueText를 고정 지표에 표시한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        audienceMetrics: [
          { metricName: 'MAU', valueNumeric: 160_000, valueText: '16만 명' },
          { metricName: 'DAU', valueNumeric: 12_000, valueText: '1.2만 명' },
        ],
      }),
    );

    expect(result.audience.userScale).toBe('16만 명');
    expect(result.audience.dailyActiveUsers).toBe('1.2만 명');
  });

  it('MAU와 DAU의 valueText가 없으면 -로 표시한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        audienceMetrics: [
          { metricName: 'MAU', valueNumeric: 160_000 },
          { metricName: 'DAU', valueNumeric: 12_000 },
        ],
      }),
    );

    expect(result.audience.userScale).toBe('-');
    expect(result.audience.dailyActiveUsers).toBe('-');
  });

  it('대표 연령대 텍스트를 그대로 표시한다', () => {
    const result = toChannelDetailViewModel(createChannelDetail({ primaryAgeBand: '30대 이상' }));

    expect(result.audience.primaryAgeBand).toBe('30대 이상');
  });
});
