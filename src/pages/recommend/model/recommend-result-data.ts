/**
 * 추천 결과 화면에 표시할 목 추천 데이터.
 * 실제 추천 API와 알고리즘은 CHA-9 범위에서 제외한다.
 */

/** 추천 카드 하단에 보여줄 간단 지표. */
export type ResultMetric = {
  label: string;
  value: string;
};

/** 추천 결과 카드 한 개를 구성하는 표시 데이터. */
export type ResultItem = {
  id: string;
  channelName: string;
  title: string;
  description: string;
  tagList: string[];
  metricList: ResultMetric[];
};

export const RESULT_ITEM_LIST = [
  {
    id: 'META_ADS',
    channelName: '메타 광고',
    title: '빠른 반응을 확인하기 좋은 소셜 채널',
    description: '관심사와 행동 기반 타깃팅으로 초기 전환 신호를 빠르게 확인할 수 있어요.',
    tagList: ['전환', '관심사 타깃', '소셜'],
    metricList: [
      { label: '추천 적합도', value: '높음' },
      { label: '운영 난이도', value: '보통' },
    ],
  },
  {
    id: 'GOOGLE_SEARCH_ADS',
    channelName: '구글 검색 광고',
    title: '명확한 수요를 가진 사용자를 잡는 채널',
    description: '검색 의도가 있는 사용자에게 노출되어 클릭과 전환 흐름을 만들기 좋아요.',
    tagList: ['검색', '트래픽', '전환'],
    metricList: [
      { label: '추천 적합도', value: '높음' },
      { label: '운영 난이도', value: '낮음' },
    ],
  },
  {
    id: 'YOUTUBE_VIDEO_ADS',
    channelName: '유튜브 비디오 광고',
    title: '브랜드와 사용 장면을 보여주기 좋은 채널',
    description: '서비스의 차별점이나 사용 맥락을 영상으로 설명해야 할 때 적합해요.',
    tagList: ['영상', '인지', '브랜딩'],
    metricList: [
      { label: '추천 적합도', value: '보통' },
      { label: '운영 난이도', value: '보통' },
    ],
  },
] as const satisfies readonly ResultItem[];
