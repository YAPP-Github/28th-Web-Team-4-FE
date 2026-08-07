import { createPageMetadata } from '@/shared/lib/metadata/create-page-metadata';

import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...createPageMetadata({
    title: '채소ZIP',
    description:
      '어떤 광고 채널을 써야 할지 막막할 때, 채널 추천부터 비교와 예상 성과까지 한 번에 알려드려요.',
    openGraphTitle: '내 서비스에 딱 맞는 광고 채널 찾기',
    openGraphDescription: '채널 추천부터 예상 성과까지, 채소ZIP에서 바로 확인해 보세요.',
    image: '/open-graph/home.png',
  }),
};
