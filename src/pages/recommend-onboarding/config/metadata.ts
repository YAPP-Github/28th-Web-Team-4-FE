import { createPageMetadata } from '@/shared/lib/metadata/create-page-metadata';

export const metadata = createPageMetadata({
  path: '/recommend',
  title: '맞춤 채널 추천 | 채소ZIP',
  description: '서비스 정보와 광고 조건을 입력해 보세요. 딱 맞는 광고 채널을 바로 찾아드릴게요.',
  openGraphTitle: '어떤 광고 채널이 우리 서비스에 맞을까?',
  openGraphDescription: '조건만 입력하면 가장 효과적인 채널을 추천해 드려요.',
  image: '/open-graph/recommend.png',
});
