// 히어로 모션 인트로 전용 정적 콘텐츠.
// 다른 pages 슬라이스(simulator/recommend-result)의 모델을 가져오면 같은 레이어
// cross-slice import가 되므로, 홈 히어로에 쓰일 값은 이 슬라이스 안에 둔다.
//
// 채널별 수치는 Figma 목업(node 3766:110383)에 실제 박혀 있는 예시 값을 그대로 옮긴 것으로,
// 실제 시뮬레이터 결과가 아닌 "미리보기용" 더미 데이터다.

export const HERO_TAGLINE_WORDS = ['Find', 'your', 'channel,', 'Fuel', 'your', 'growth'] as const;

// 스크롤로 넘어간 뒤 나타나는 실제 페이지 제목(Figma node 3766:110383) — 영어 태그라인은
// 오토플레이 인트로용 장식 카피이고, 이 두 줄이 홈의 진짜(semantic) h1이다.
export const HERO_REVEAL_TITLE_LINES = [
  '내게 맞는 광고 채널을 한눈에!',
  '광고 채널 고민, 여기서 끝내 보세요',
] as const;
export const HERO_SUBTEXT = '내 서비스에 딱 맞는 채널을 한눈에 찾아주는 채널 소개 모음집';
export const HERO_REVEAL_CTA_LABEL = '3초 만에 시작하기';

export const HERO_TOTAL_SUMMARY = {
  channelCount: { value: '3개', label: '집행 가능 채널' },
  impressions: { value: '32,000회', label: '예상 총 노출' },
  clicks: { value: '258회', label: '예상 총 클릭' },
};

export type HeroResultChannel = {
  id: string;
  name: string;
  iconSrc: string;
  isEstimated: boolean;
  impressions: { value: string; fillPercentage: number };
  clicks: { value: string; fillPercentage: number };
};

export const HERO_RESULT_CHANNELS: HeroResultChannel[] = [
  {
    id: 'naver-search',
    name: '네이버 검색 광고',
    iconSrc: '/simulator-assets/naver.png',
    isEstimated: true,
    impressions: { value: '22,000~32,000회', fillPercentage: 77 },
    clicks: { value: '624~780회', fillPercentage: 64 },
  },
  {
    id: 'newscash',
    name: '뉴스캐시',
    iconSrc: '/simulator-assets/newscash.png',
    isEstimated: true,
    impressions: { value: '10,000회', fillPercentage: 35 },
    clicks: { value: '240~300회', fillPercentage: 23 },
  },
  {
    id: 'meta',
    name: '메타 광고',
    iconSrc: '/simulator-assets/meta.svg',
    isEstimated: false,
    impressions: { value: '-', fillPercentage: 0 },
    clicks: { value: '-', fillPercentage: 0 },
  },
];
