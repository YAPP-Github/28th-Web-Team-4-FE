import { client } from '@/shared/api/generated/client.gen';
import { markApiClientError } from '@/shared/lib/sentry/error-reporting';

let isRegistered = false;

export function registerSentryApiErrorInterceptor(): void {
  if (isRegistered) {
    return;
  }

  client.interceptors.error.use((error, response) => markApiClientError(error, response));
  isRegistered = true;
}
