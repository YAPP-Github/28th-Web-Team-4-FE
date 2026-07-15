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
