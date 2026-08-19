import type { Metadata } from 'next';

type SearchEngineVerificationTokens = {
  google?: string;
  naver?: string;
  bing?: string;
};

function normalizeToken(token: string | undefined): string | undefined {
  const normalizedToken = token?.trim();

  return normalizedToken === '' ? undefined : normalizedToken;
}

export function createSearchEngineVerification({
  google,
  naver,
  bing,
}: SearchEngineVerificationTokens): Metadata['verification'] {
  const googleToken = normalizeToken(google);
  const naverToken = normalizeToken(naver);
  const bingToken = normalizeToken(bing);
  const other = {
    ...(naverToken ? { 'naver-site-verification': naverToken } : {}),
    ...(bingToken ? { 'msvalidate.01': bingToken } : {}),
  };

  if (!googleToken && Object.keys(other).length === 0) {
    return undefined;
  }

  return {
    ...(googleToken ? { google: googleToken } : {}),
    ...(Object.keys(other).length > 0 ? { other } : {}),
  };
}

export const nonIndexableMetadata: Metadata = {
  alternates: {
    canonical: null,
  },
  robots: {
    index: false,
    follow: false,
  },
};
