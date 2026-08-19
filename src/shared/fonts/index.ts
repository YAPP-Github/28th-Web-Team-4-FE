import localFont from 'next/font/local';

/**
 * Pretendard Variable — `--font-pretendard`로 로드 후 globals에서 `--font-pre`에 매핑합니다.
 * weight 범위를 지정하지 않으면 WebKit에서 굵기가 잘못 렌더링될 수 있습니다.
 * @see https://github.com/orioncactus/pretendard#nextjs
 */
export const pretendard = localFont({
  src: './pretendard/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/**
 * Wanted Sans Variable — `--font-wanted-sans`.
 * 사이트 기본 폰트는 여전히 Pretendard이며, 이 폰트는 홈 히어로 헤드라인처럼
 * 명시적으로 지정한 요소에만 유틸리티 클래스(`font-wanted-sans`)로 적용한다.
 */
export const wantedSans = localFont({
  src: './wanted-sans/WantedSansVariable.woff2',
  display: 'swap',
  weight: '400 900',
  variable: '--font-wanted-sans',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});
