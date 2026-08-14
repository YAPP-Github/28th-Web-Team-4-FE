import type { CreateClientConfig } from './generated/client.gen';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const isBrowser = typeof window !== 'undefined';
const browserApiBaseUrl = '/api/backend';

export const createClientConfig: CreateClientConfig = (config) => {
  const baseUrl = isBrowser ? browserApiBaseUrl : apiBaseUrl;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL must be set at build time.');
  }

  return {
    ...config,
    baseUrl,
    ...(isBrowser ? { credentials: 'same-origin' as const } : {}),
  };
};
