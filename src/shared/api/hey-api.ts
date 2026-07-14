import type { CreateClientConfig } from './generated/client.gen';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...(apiBaseUrl ? { baseUrl: apiBaseUrl } : {}),
});
