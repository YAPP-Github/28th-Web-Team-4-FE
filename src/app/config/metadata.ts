import { createSearchEngineVerification } from './search-metadata';
import { SITE_URL } from './site-url';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '채소ZIP',
  description:
    '어떤 광고 채널을 써야 할지 막막할 때, 채널 추천부터 비교와 예상 성과까지 한 번에 알려드려요.',
  verification: createSearchEngineVerification({
    google: process.env.GOOGLE_SITE_VERIFICATION,
    naver: process.env.NAVER_SITE_VERIFICATION,
    bing: process.env.BING_SITE_VERIFICATION,
  }),
};
