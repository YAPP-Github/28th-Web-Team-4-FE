import * as Sentry from '@sentry/nextjs';

import { captureBoundaryError, captureQueryError, markApiClientError } from './error-reporting';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn<typeof Sentry.captureException>(),
}));

const captureExceptionMock = vi.mocked(Sentry.captureException);

describe('Sentry error reporting', () => {
  it('reports an API 5xx once after the query reaches its final error state', () => {
    const error = markApiClientError(
      { message: 'upstream unavailable' },
      new Response(null, { status: 503 }),
    );

    captureQueryError(error, 'query');
    captureBoundaryError(error, {
      boundary: 'react-error-boundary',
      feature: 'channel-detail',
      operation: 'query-render',
    });

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error), {
      tags: {
        feature: 'api-client',
        'http.status_code': 503,
        operation: 'query',
      },
    });
  });

  it.each([400, 401, 422])('does not report an expected API %s error', (status) => {
    const error = markApiClientError(
      { message: 'expected response' },
      new Response(null, { status }),
    );

    captureQueryError(error, 'query');
    captureBoundaryError(error, {
      boundary: 'react-error-boundary',
      feature: 'channel-detail',
      operation: 'query-render',
    });

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('does not report a successful response parsing failure', () => {
    const error = markApiClientError(
      new SyntaxError('invalid JSON'),
      new Response(null, { status: 200 }),
    );

    captureQueryError(error, 'query');

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('does not report a client network failure', () => {
    const error = markApiClientError(new TypeError('Failed to fetch'));

    captureQueryError(error, 'mutation');

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('does not report query failures from the server query client', () => {
    const error = new Error('server query failed');
    vi.stubGlobal('window', undefined);

    try {
      captureQueryError(error, 'query');
    } finally {
      vi.unstubAllGlobals();
    }

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('leaves a non-API query error to the rendering boundary', () => {
    const error = new Error('query failed');

    captureQueryError(error, 'query');
    captureBoundaryError(error, {
      boundary: 'react-error-boundary',
      feature: 'channel-detail',
      operation: 'query-render',
    });

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      tags: {
        boundary: 'react-error-boundary',
        feature: 'channel-detail',
        operation: 'query-render',
      },
    });
  });

  it('reports a manual fetch 5xx error from the query cache', () => {
    const error = Object.assign(new Error('server error'), { status: 500 });

    captureQueryError(error, 'query');

    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      tags: {
        feature: 'api-client',
        'http.status_code': 500,
        operation: 'query',
      },
    });
  });

  it('reports a render error at its boundary', () => {
    const error = new Error('render failed');

    captureBoundaryError(error, {
      boundary: 'next-route',
      feature: 'recommend-result',
      operation: 'render',
    });

    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      tags: {
        boundary: 'next-route',
        feature: 'recommend-result',
        operation: 'render',
      },
    });
  });
});
