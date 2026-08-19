import type { Metadata } from 'next';

const NAVER_SITE_VERIFICATION = '0a29cc6284363122ae5fe024600f151f6d1fd0e3';

export const searchEngineVerification = {
  other: {
    'naver-site-verification': NAVER_SITE_VERIFICATION,
  },
} satisfies NonNullable<Metadata['verification']>;

export const nonIndexableMetadata: Metadata = {
  alternates: {
    canonical: null,
  },
  robots: {
    index: false,
    follow: false,
  },
};
