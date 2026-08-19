import { createPageMetadata } from '@/shared/lib/metadata/create-page-metadata';

describe('createPageMetadata', () => {
  it('일반, Open Graph, Twitter/X 메타데이터를 생성한다', () => {
    const metadata = createPageMetadata({
      path: '/recommend',
      title: '맞춤 채널 추천 | 채소ZIP',
      description: '서비스에 맞는 광고 채널을 찾아드려요.',
      openGraphTitle: '어떤 광고 채널이 우리 서비스에 맞을까?',
      openGraphDescription: '조건만 입력하면 가장 효과적인 채널을 추천해 드려요.',
      image: '/open-graph/recommend.png',
    });

    expect(metadata).toEqual({
      title: '맞춤 채널 추천 | 채소ZIP',
      description: '서비스에 맞는 광고 채널을 찾아드려요.',
      alternates: {
        canonical: '/recommend',
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: '어떤 광고 채널이 우리 서비스에 맞을까?',
        description: '조건만 입력하면 가장 효과적인 채널을 추천해 드려요.',
        url: '/recommend',
        siteName: '채소ZIP',
        locale: 'ko_KR',
        type: 'website',
        images: [
          {
            url: '/open-graph/recommend.png',
            width: 1200,
            height: 630,
            alt: '어떤 광고 채널이 우리 서비스에 맞을까?',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: '어떤 광고 채널이 우리 서비스에 맞을까?',
        description: '조건만 입력하면 가장 효과적인 채널을 추천해 드려요.',
        images: [
          {
            url: '/open-graph/recommend.png',
            alt: '어떤 광고 채널이 우리 서비스에 맞을까?',
          },
        ],
      },
    });
  });
});
