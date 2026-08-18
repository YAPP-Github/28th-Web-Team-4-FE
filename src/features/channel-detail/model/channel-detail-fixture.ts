import type { ChannelDetail } from './channel-detail';

/** 채널 상세 모달의 고정 데이터 진입점과 Storybook에서 사용하는 UI 픽스처 */
export const CHANNEL_DETAIL_FIXTURE: ChannelDetail = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: '메타 광고',
  logoUrl: 'https://cdn.chaeso.zip/channels/meta-logo.png',
  tagline: '퍼포먼스와 브랜딩을 모두 커버하는 국내 최다 사용 채널',
  summary: {
    paragraphs: [
      '메타 광고는 Facebook과 Instagram을 통해 정교한 관심사 기반 타기팅을 제공해요.',
      '특히, 구매 전환 목적의 쇼핑 업종에서 높은 효율을 보여요.',
      '다양한 크리에이티브 포맷으로 브랜드 인지와 전환을 동시에 달성할 수 있어요.',
    ],
    recommendationReason: {
      category: '쇼핑·커머스',
      objective: '구매 전환',
      objectiveWithParticle: '구매 전환을',
      budget: '20만 원~500만 원',
      rationale: '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로',
    },
  },
  products: [
    {
      id: 'product-feed',
      name: '피드 광고',
      budgetRange: '20~50만 원',
      expectedImpressions: '5~15만 회',
      expectedClicks: '600회',
    },
    {
      id: 'product-story',
      name: '스토리 광고',
      budgetRange: '30~100만 원',
      expectedImpressions: '10~30만 회',
      expectedClicks: '-',
    },
    {
      id: 'product-retargeting',
      name: '리타기팅 광고',
      budgetRange: '50만 원 이상',
      expectedImpressions: '맞춤 설정',
      expectedClicks: '-',
    },
  ],
  productsNote: '일부 채널은 해당 지표를 공개하지 않아요.',
  audience: {
    primaryAgeBand: '20~40대',
    primaryGender: '남성',
    metrics: [
      { label: '사용자 규모', value: '16만 명' },
      { label: '하루 활성 사용자', value: '1.2만 명' },
    ],
    traits: '뉴스를 읽고 리워드를 적립하는 적극적 유저',
  },
  similarCases: [
    '내셔널지오그래픽',
    '글로벌 아웃도어 캠핑 축제 <고씨에프>',
    '<연천군> 2025 캠핑요리축제',
  ],
};

export const CHANNEL_DETAIL_EMPTY_PRODUCTS_FIXTURE: ChannelDetail = {
  ...CHANNEL_DETAIL_FIXTURE,
  id: 'channel-empty-products',
  products: [],
};
