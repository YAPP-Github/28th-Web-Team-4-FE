const TEMPORARY_CHANNEL_LOGOS = [
  {
    keywords: ['네이버', 'naver'],
    src: '/compare-assets/naver.png',
  },
  {
    keywords: ['카카오', 'kakao'],
    src: '/compare-assets/kakao.png',
  },
  {
    keywords: ['메타', 'meta', '인스타그램', 'instagram', '페이스북', 'facebook'],
    src: '/compare-assets/meta.png',
  },
  {
    keywords: ['유튜브', 'youtube'],
    src: '/compare-assets/youtube.png',
  },
  {
    keywords: ['뉴스캐시', 'news cash', 'newscash'],
    src: '/compare-assets/news-cash.png',
  },
] as const;

/** 백엔드 iconUrl이 비어 있을 때 사용하는 채널명 기반 임시 로고 매핑이다. */
export function getTemporaryChannelLogoSrc(channelName: string): string | null {
  const normalizedName = channelName.trim().toLocaleLowerCase('ko-KR');
  const matchedLogo = TEMPORARY_CHANNEL_LOGOS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  return matchedLogo?.src ?? null;
}
