import type { ChannelDetailResponse } from '@/shared/api/generated';

import { toChannelDetailViewModel } from './channel-detail-adapter';

type ChannelDetailApiModel = NonNullable<ChannelDetailResponse>;
type ChannelDetailFixture = ChannelDetailApiModel;

function createChannelDetail(overrides: Partial<ChannelDetailFixture> = {}): ChannelDetailFixture {
  return {
    id: 'channel-meta',
    name: '메타 광고',
    iconUrl: ' https://cdn.example.com/meta.png ',
    tagline: ' 퍼포먼스와 브랜딩을 모두 커버하는 채널 ',
    description: ' 정교한 관심사 타기팅을 제공해요. ',
    primaryCategory: 'SHOPPING_COMMERCE',
    mediaType: 'SNS',
    suitableCategories: ['SHOPPING_COMMERCE'],
    ageBandCodes: ['AGE_20S', 'AGE_30S', 'AGE_40S'],
    primaryAgeBand: ' 20~40대 ',
    primaryGender: 'FEMALE',
    audienceSummary: '쇼핑 관심 고객',
    audienceTraits: ' 구매 의도가 높은 사용자 ',
    advantages: [' 높은 전환 효율 ', '다양한 크리에이티브 포맷'],
    minBudgetWon: 200_000,
    maxBudgetWon: 500_000,
    executionType: 'SELF',
    adFormats: ['피드', '스토리'],
    targetingMethods: ['관심사'],
    tags: [],
    products: [
      {
        id: 'product-feed',
        productName: ' 피드 광고 ',
        inventoryType: null,
        supportedObjectives: ['CONVERSION'],
        minBudgetWon: 200_000,
        maxBudgetWon: 500_000,
        expectedImpressions: 150_000,
        expectedClicks: 1_800,
        expectedPeriod: '1주',
        pricing: [],
        isExecutable: true,
      },
      {
        id: 'product-story',
        productName: null,
        inventoryType: '스토리',
        supportedObjectives: ['AWARENESS'],
        minBudgetWon: 300_000,
        maxBudgetWon: null,
        expectedImpressions: null,
        expectedClicks: 700,
        expectedPeriod: null,
        pricing: [],
        isExecutable: false,
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
        period: null,
      },
    ],
    references: ['브랜드 캠페인 A', '전환 캠페인 B'],
    recommendationBasis: {
      objective: 'TRAFFIC',
      category: 'SHOPPING_COMMERCE',
      budgetMin: 3_000_000,
      budgetMax: 10_000_000,
    },
    ...overrides,
  };
}

describe('toChannelDetailViewModel', () => {
  it('상세 응답의 설명, 상품, 오디언스 지표와 집행 사례를 표시 모델로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({ tags: [' KPI 최적 ', '입문자 추천', ' '] }),
    );

    expect(result).toMatchObject({
      id: 'channel-meta',
      name: '메타 광고',
      iconUrl: 'https://cdn.example.com/meta.png',
      tagline: '퍼포먼스와 브랜딩을 모두 커버하는 채널',
      summary: {
        keywords: ['KPI 최적', '입문자 추천'],
        paragraphs: ['정교한 관심사 타기팅을 제공해요.'],
        recommendationReason: {
          category: '쇼핑·커머스',
          objective: '트래픽 유입',
          objectiveWithParticle: '트래픽 유입을',
          budget: '300만 원~1,000만 원',
          rationale:
            '관심사에 맞는 고객에게 광고를 노출해 사이트 방문으로 이어질 가능성이 가장 높으므로',
        },
      },
      audience: {
        primaryAgeBand: '20~40대',
        primaryGender: '여성',
        metrics: [
          { label: 'MAU', value: '16만 명' },
          { label: 'DAU', value: '약 1.2만 명' },
        ],
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
        expectedClicks: '1,800회',
        isExecutable: true,
      },
      {
        id: 'product-story',
        name: '스토리',
        budgetRange: '30만 원 이상',
        expectedImpressions: '-',
        expectedClicks: '700회',
        isExecutable: false,
      },
    ]);
  });

  it('nullable 필드가 null이면 화면에서 사용할 기본 표시값으로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        iconUrl: null,
        tagline: null,
        description: null,
        primaryAgeBand: null,
        primaryGender: 'ALL',
        audienceSummary: '짧은 오디언스 요약은 유저 특성으로 쓰지 않는다',
        audienceTraits: null,
        advantages: [],
        products: [
          {
            id: 'product-unknown',
            productName: null,
            inventoryType: null,
            supportedObjectives: [],
            minBudgetWon: null,
            maxBudgetWon: null,
            expectedImpressions: null,
            expectedClicks: null,
            expectedPeriod: null,
            pricing: [],
            isExecutable: null,
          },
        ],
        audienceMetrics: [],
        recommendationBasis: null,
        tags: [],
      }),
    );

    expect(result.iconUrl).toBe('');
    expect(result.tagline).toBe('');
    expect(result.summary.paragraphs).toEqual([]);
    expect(result.summary.keywords).toEqual([]);
    expect(result.summary.recommendationReason).toBeNull();
    expect(result.products).toEqual([
      {
        id: 'product-unknown',
        name: '상품명 미제공',
        budgetRange: '-',
        expectedImpressions: '-',
        expectedClicks: '-',
        isExecutable: null,
      },
    ]);
    expect(result.audience).toEqual({
      primaryAgeBand: '-',
      primaryGender: '전체',
      metrics: [],
      traits: '-',
    });
  });

  it('상품의 예산·CTR·노출이 null이면 0이 아니라 기본 표시값으로 변환한다', () => {
    // 실 API는 값 없음을 undefined가 아니라 null로 내려준다.
    const nullProduct = {
      id: 'product-null',
      productName: '집행 정보 미제공 상품',
      inventoryType: null,
      supportedObjectives: [],
      minBudgetWon: null,
      maxBudgetWon: null,
      expectedImpressions: null,
      expectedClicks: null,
      expectedPeriod: null,
      pricing: [],
      isExecutable: null,
    } satisfies ChannelDetailApiModel['products'][number];

    const result = toChannelDetailViewModel(createChannelDetail({ products: [nullProduct] }));

    expect(result.products).toEqual([
      {
        id: 'product-null',
        name: '집행 정보 미제공 상품',
        budgetRange: '-',
        expectedImpressions: '-',
        expectedClicks: '-',
        isExecutable: null,
      },
    ]);
  });

  it('상품 집행 가능 여부를 true, false, null 그대로 보존한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        products: [
          {
            id: 'product-executable',
            productName: '집행 가능 상품',
            inventoryType: null,
            supportedObjectives: [],
            minBudgetWon: null,
            maxBudgetWon: null,
            expectedImpressions: null,
            expectedClicks: null,
            expectedPeriod: null,
            pricing: [],
            isExecutable: true,
          },
          {
            id: 'product-unavailable',
            productName: '집행 불가 상품',
            inventoryType: null,
            supportedObjectives: [],
            minBudgetWon: null,
            maxBudgetWon: null,
            expectedImpressions: null,
            expectedClicks: null,
            expectedPeriod: null,
            pricing: [],
            isExecutable: false,
          },
          {
            id: 'product-unknown',
            productName: '판정 불가 상품',
            inventoryType: null,
            supportedObjectives: [],
            minBudgetWon: null,
            maxBudgetWon: null,
            expectedImpressions: null,
            expectedClicks: null,
            expectedPeriod: null,
            pricing: [],
            isExecutable: null,
          },
        ],
      }),
    );

    expect(result.products.map((product) => product.isExecutable)).toEqual([true, false, null]);
  });

  it('tags를 trim하고 빈 문자열을 제거해 핵심 요약 keyword로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        tags: [' KPI 최적 ', '', '  ', '입문자 추천'],
      }),
    );

    expect(result.summary.keywords).toEqual(['KPI 최적', '입문자 추천']);
  });

  it('tags가 비어 있으면 핵심 요약 keyword도 빈 배열로 변환한다', () => {
    const result = toChannelDetailViewModel(createChannelDetail({ tags: [] }));

    expect(result.summary.keywords).toEqual([]);
  });

  it('오디언스 지표를 이름으로 필터링하지 않고 응답 순서대로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        audienceMetrics: [
          {
            metricName: ' 주간 순사용자 ',
            valueNumeric: 80_000,
            valueText: ' 8만 명 ',
            unit: null,
            period: null,
          },
          {
            metricName: '가입자 수',
            valueNumeric: 240_000,
            valueText: '24만 명',
            unit: null,
            period: null,
          },
        ],
      }),
    );

    expect(result.audience.metrics).toEqual([
      { label: '주간 순사용자', value: '8만 명' },
      { label: '가입자 수', value: '24만 명' },
    ]);
  });

  it('오디언스 지표의 valueText가 null 또는 공백이면 -로 표시한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        audienceMetrics: [
          {
            metricName: '월간 사용자',
            valueNumeric: 160_000,
            valueText: null,
            unit: '명',
            period: null,
          },
          {
            metricName: '주간 사용자',
            valueNumeric: 80_000,
            valueText: '   ',
            unit: '명',
            period: null,
          },
        ],
      }),
    );

    expect(result.audience.metrics).toEqual([
      { label: '월간 사용자', value: '-' },
      { label: '주간 사용자', value: '-' },
    ]);
  });

  it('대표 연령대 텍스트를 그대로 표시한다', () => {
    const result = toChannelDetailViewModel(createChannelDetail({ primaryAgeBand: '30대 이상' }));

    expect(result.audience.primaryAgeBand).toBe('30대 이상');
  });

  it('tagline, 핵심 요약 description, recommendationBasis를 서로 다른 값으로 변환한다', () => {
    const result = toChannelDetailViewModel(
      createChannelDetail({
        tagline: '검색 의도가 높은 고객에게 도달하기 좋아요',
        description: '검색 광고에 적합한 채널이에요.',
        recommendationBasis: {
          objective: 'CONVERSION',
          category: 'GAME',
          budgetMin: 500_000,
          budgetMax: 500_000,
        },
      }),
    );

    expect(result.tagline).toBe('검색 의도가 높은 고객에게 도달하기 좋아요');
    expect(result.summary.keywords).toEqual([]);
    expect(result.summary.paragraphs).toEqual(['검색 광고에 적합한 채널이에요.']);
    expect(result.summary.recommendationReason).toEqual({
      category: '게임',
      objective: '구매 전환',
      objectiveWithParticle: '구매 전환을',
      budget: '50만 원',
      rationale: '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로',
    });
  });
});
