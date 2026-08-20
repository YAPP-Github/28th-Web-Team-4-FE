import type { Metadata } from 'next';

const SITE_NAME = '채소ZIP';
const OPEN_GRAPH_IMAGE_WIDTH = 1200;
const OPEN_GRAPH_IMAGE_HEIGHT = 630;

type CreatePageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  image: string;
};

/** Creates static page metadata with matching Open Graph and Twitter/X cards. */
export function createPageMetadata({
  path,
  title,
  description,
  openGraphTitle,
  openGraphDescription,
  image,
}: CreatePageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: path,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: image,
          width: OPEN_GRAPH_IMAGE_WIDTH,
          height: OPEN_GRAPH_IMAGE_HEIGHT,
          alt: openGraphTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle,
      description: openGraphDescription,
      images: [
        {
          url: image,
          alt: openGraphTitle,
        },
      ],
    },
  };
}
