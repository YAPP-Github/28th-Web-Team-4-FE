import * as Sentry from '@sentry/nextjs';

type ApiErrorInterceptor = (error: unknown, response?: Response) => object;

const clientMock = vi.hoisted(() => ({
  use: vi.fn<(interceptor: ApiErrorInterceptor) => number>(),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn<typeof Sentry.captureException>(),
}));
vi.mock('@/shared/api/generated/client.gen', () => ({
  client: {
    interceptors: {
      error: {
        use: clientMock.use,
      },
    },
  },
}));

describe('Sentry API error interceptor', () => {
  it('registers once and preserves the error for final QueryCache reporting', async () => {
    const { registerSentryApiErrorInterceptor } = await import('./sentry-api-error-interceptor');
    const { captureQueryError } = await import('@/shared/lib/sentry/error-reporting');

    registerSentryApiErrorInterceptor();
    registerSentryApiErrorInterceptor();

    expect(clientMock.use).toHaveBeenCalledOnce();

    const interceptor = clientMock.use.mock.calls[0]?.[0];
    const error = { message: 'service unavailable' };
    const interceptedError = interceptor?.(error, new Response(null, { status: 500 }));

    expect(interceptedError).toBe(error);

    captureQueryError(interceptedError, 'query');

    expect(Sentry.captureException).toHaveBeenCalledWith(expect.any(Error), {
      tags: {
        feature: 'api-client',
        'http.status_code': 500,
        operation: 'query',
      },
    });
  });
});
