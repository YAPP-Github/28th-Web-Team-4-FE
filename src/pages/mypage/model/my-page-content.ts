export type MyAdsCondition = {
  /** 온보딩 답변을 마이페이지에서 보여줄 수 있는 형태로 가공한 태그 목록. */
  tags: readonly string[];
};

export type SavedRecommendation = {
  /** 추천 결과 상세 페이지로 이동할 때 사용하는 온보딩 식별자. */
  onboardingId: string;
  /** 사용자가 온보딩에서 입력한 서비스명. */
  title: string;
  /** 마지막 추천 일시를 화면에 표시할 문자열. */
  lastRecommendedAt: string;
  /** 추천 결과에 포함된 채널명 목록. */
  channelNames: readonly string[];
};
