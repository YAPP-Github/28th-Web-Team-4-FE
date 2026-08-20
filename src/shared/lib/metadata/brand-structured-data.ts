import { createAbsoluteSiteUrl, SITE_URL } from './site-url';

const BRAND_NAME = '채소ZIP';
const BRAND_ALTERNATE_NAMES = [
  '채소집',
  'chaesozip',
  'ChaesoZIP',
  'Chaeso Zip',
  'chaeso-zip',
] as const;
const SITE_ALTERNATE_NAMES = [...BRAND_ALTERNATE_NAMES, 'chaeso-zip.com'] as const;

export const brandStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': createAbsoluteSiteUrl('/#website'),
      name: BRAND_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: createAbsoluteSiteUrl('/'),
      inLanguage: 'ko-KR',
      publisher: {
        '@id': createAbsoluteSiteUrl('/#organization'),
      },
    },
    {
      '@type': 'Organization',
      '@id': createAbsoluteSiteUrl('/#organization'),
      name: BRAND_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: createAbsoluteSiteUrl('/open-graph/home.png'),
      description:
        '채소ZIP은 서비스 조건에 맞는 광고 채널 추천, 채널 비교, 예산별 예상 성과를 제공하는 광고 채널 선택 서비스입니다.',
    },
  ],
} as const;

export function stringifyStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
