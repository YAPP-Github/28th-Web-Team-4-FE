export type CompareChannel = {
  id: string;
  name: string;
  descriptionLines: readonly [string, string];
  category: string;
  iconSrc: string;
};

export const COMPARE_SELECTION_LIMIT = 3;

export const compareChannels = [
  {
    id: 'naver-search-ad',
    name: '네이버 검색 광고',
    descriptionLines: [
      '구매 전환 목적에 검색 의도 타기팅 최적',
      '채널 고유 정보 1~2줄 정도 나오는 텍스트 공간',
    ],
    category: '교육',
    iconSrc: '/compare-assets/naver.png',
  },
  {
    id: 'kakao-keyword-ad',
    name: '카카오 키워드 광고',
    descriptionLines: [
      '모바일 검색 맥락에서 브랜드 탐색 유도',
      '초기 고객 접점 확보에 적합한 채널',
    ],
    category: '커머스',
    iconSrc: '/compare-assets/kakao.png',
  },
  {
    id: 'meta-feed-ad',
    name: '메타 피드 광고',
    descriptionLines: ['관심사 기반 타깃에게 반복 노출 가능', '인지도와 전환 캠페인을 함께 운영'],
    category: '라이프스타일',
    iconSrc: '/compare-assets/meta.png',
  },
  {
    id: 'youtube-video-ad',
    name: '유튜브 영상 광고',
    descriptionLines: [
      '영상으로 서비스 이해도를 빠르게 전달',
      '브랜드 메시지와 제품 사용 장면에 적합',
    ],
    category: '콘텐츠',
    iconSrc: '/compare-assets/youtube.png',
  },
  {
    id: 'naver-shopping-ad',
    name: '네이버 쇼핑 광고',
    descriptionLines: [
      '구매 의도가 높은 사용자의 상품 탐색 대응',
      '가격 비교 단계에서 전환을 높이는 채널',
    ],
    category: '커머스',
    iconSrc: '/compare-assets/naver.png',
  },
  {
    id: 'kakao-bizboard',
    name: '카카오 비즈보드',
    descriptionLines: [
      '카카오 주요 지면에서 넓은 모바일 도달',
      '브랜드 인지와 프로모션 노출에 효과적',
    ],
    category: '브랜드',
    iconSrc: '/compare-assets/kakao.png',
  },
  {
    id: 'instagram-reels-ad',
    name: '인스타그램 릴스 광고',
    descriptionLines: [
      '짧은 영상 소재로 빠른 관심을 유도',
      '비주얼 중심 상품과 신규 브랜드에 적합',
    ],
    category: '콘텐츠',
    iconSrc: '/compare-assets/meta.png',
  },
  {
    id: 'youtube-shorts-ad',
    name: '유튜브 쇼츠 광고',
    descriptionLines: ['숏폼 소비 맥락에서 반복 노출 가능', '가벼운 메시지와 이벤트 확산에 적합'],
    category: '콘텐츠',
    iconSrc: '/compare-assets/youtube.png',
  },
  {
    id: 'naver-display-ad',
    name: '네이버 디스플레이 광고',
    descriptionLines: ['포털 지면에서 안정적인 도달을 확보', '리마케팅과 신규 고객 확장에 활용'],
    category: '브랜드',
    iconSrc: '/compare-assets/naver.png',
  },
  {
    id: 'kakao-channel-message',
    name: '카카오 채널 메시지',
    descriptionLines: ['친구 기반 고객에게 직접 메시지를 전달', '재방문과 프로모션 안내에 효과적'],
    category: 'CRM',
    iconSrc: '/compare-assets/kakao.png',
  },
  {
    id: 'meta-story-ad',
    name: '메타 스토리 광고',
    descriptionLines: ['전면형 소재로 짧은 몰입을 만들기 좋음', '모바일 중심 캠페인에 적합한 채널'],
    category: '라이프스타일',
    iconSrc: '/compare-assets/meta.png',
  },
  {
    id: 'youtube-instream-ad',
    name: '유튜브 인스트림 광고',
    descriptionLines: [
      '콘텐츠 시청 전후 브랜드 메시지 노출',
      '제품 이해와 신뢰 형성에 적합한 채널',
    ],
    category: '교육',
    iconSrc: '/compare-assets/youtube.png',
  },
] as const satisfies readonly CompareChannel[];
