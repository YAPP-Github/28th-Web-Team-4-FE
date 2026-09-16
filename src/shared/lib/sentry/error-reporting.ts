import * as Sentry from '@sentry/nextjs';

type ErrorReportTags = Record<string, boolean | number | string>;

type ApiErrorMetadata = {
  status?: number;
};

const apiErrorMetadata = new WeakMap<object, ApiErrorMetadata>();

function isObject(value: unknown): value is object {
  return (typeof value === 'object' && value !== null) || typeof value === 'function';
}

function normalizeApiError(error: unknown): object {
  if (isObject(error)) {
    return error;
  }

  return new Error('API request failed.');
}

function toReportableException(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Unexpected non-Error exception.');
}

function getErrorStatus(error: unknown): number | undefined {
  if (!isObject(error) || !('status' in error)) {
    return undefined;
  }

  return typeof error.status === 'number' ? error.status : undefined;
}

export function captureException(error: unknown, tags: ErrorReportTags): void {
  Sentry.captureException(toReportableException(error), { tags });
}

export function markApiClientError(error: unknown, response?: Response): object {
  const normalizedError = normalizeApiError(error);

  apiErrorMetadata.set(normalizedError, response ? { status: response.status } : {});

  return normalizedError;
}

export function captureQueryError(error: unknown, operation: 'mutation' | 'query'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const metadata = isObject(error) ? apiErrorMetadata.get(error) : undefined;
  const status = metadata?.status ?? getErrorStatus(error);

  if (status === undefined || status < 500) {
    return;
  }

  captureException(error, {
    feature: 'api-client',
    'http.status_code': status,
    operation,
  });
}

export function captureBoundaryError(error: unknown, tags: ErrorReportTags): void {
  if ((isObject(error) && apiErrorMetadata.has(error)) || getErrorStatus(error) !== undefined) {
    return;
  }

  captureException(error, tags);
}
