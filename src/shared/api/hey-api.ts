import type { CreateClientConfig } from './generated/client.gen';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const createClientConfig: CreateClientConfig = (config) => {
  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL must be set at build time.');
  }

  return {
    ...config,
    baseUrl: apiBaseUrl,
  };
};
