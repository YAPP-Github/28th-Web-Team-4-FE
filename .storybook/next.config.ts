import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.chaeso-zip.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.chaeso.zip',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
