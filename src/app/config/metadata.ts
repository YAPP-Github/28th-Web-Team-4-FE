import { searchEngineVerification } from './search-metadata';
import { SITE_URL } from './site-url';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: '채소ZIP',
  title: '채소ZIP',
  description:
    '어떤 광고 채널을 써야 할지 막막할 때, 채널 추천부터 비교와 예상 성과까지 한 번에 알려드려요.',
  keywords: [
    '채소ZIP',
    '채소집',
    'chaesozip',
    'ChaesoZIP',
    'Chaeso Zip',
    'chaeso-zip',
    '광고 채널 추천',
    '광고 채널 비교',
    '광고 예산 시뮬레이터',
  ],
  verification: searchEngineVerification,
};
