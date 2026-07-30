export type ChannelSummaryHighlightSegment =
  | { type: 'text'; value: string }
  | { type: 'tag'; value: string };

export type ChannelSummaryHighlight = {
  segments: ChannelSummaryHighlightSegment[];
};

export type ChannelProductRow = {
  name: string;
  budgetRange: string;
  expectedImpressions: string;
  ctr: string | null;
  available: boolean;
};

export type ChannelAudience = {
  primaryAgeBand: string;
  primaryGender: string;
  userScale: string;
  dailyActiveUsers: string;
  traits: string;
};

export type ChannelDetail = {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  summary: {
    paragraphs: string[];
    highlights: ChannelSummaryHighlight[];
  };
  products: ChannelProductRow[];
  productsNote: string;
  audience: ChannelAudience;
  similarCases: string[];
};

/** Figma 채널 상세 모달 기준 UI 픽스처 (패칭 연동 전) */
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
    highlights: [
      {
        segments: [
          { type: 'text', value: 'YAPP 님이 입력하신 ' },
          { type: 'tag', value: '구매 전환 목적' },
          { type: 'text', value: ' ' },
          { type: 'tag', value: '쇼핑·커머스 업종' },
          { type: 'text', value: ' ' },
          { type: 'tag', value: '50만 원 미만' },
          { type: 'text', value: ' 기준 도달 효율이 가장 높아요.' },
        ],
      },
    ],
  },
  products: [
    {
      name: '피드 광고',
      budgetRange: '20~50만 원',
      expectedImpressions: '5~15만 회',
      ctr: '1.2%',
      available: true,
    },
    {
      name: '스토리 광고',
      budgetRange: '30~100만 원',
      expectedImpressions: '10~30만 회',
      ctr: null,
      available: true,
    },
    {
      name: '리타기팅 광고',
      budgetRange: '50만 원 이상',
      expectedImpressions: '맞춤 설정',
      ctr: null,
      available: false,
    },
  ],
  productsNote: '일부 채널은 해당 지표를 공개하지 않아요.',
  audience: {
    primaryAgeBand: '20~40대',
    primaryGender: '남성',
    userScale: '16만 명',
    dailyActiveUsers: '1.2만 명',
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
