import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.chaeso-zip.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  // 빈 문자열("")도 undefined로 처리해야 하므로 ??가 아닌 ||가 의도된 동작
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  ...(isProd && {
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
  }),
};

export default withSentryConfig(nextConfig, {
  org: 'yapp-7o',
  project: 'frontend',
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,
  tunnelRoute: '/sentry-tunnel',
});
