import { ensureResponseOk, parseJsonResponse } from './response';

describe('API response helpers', () => {
  it('parses a successful JSON response', async () => {
    const response = Response.json({ success: true });

    await expect(parseJsonResponse(response)).resolves.toEqual({ success: true });
  });

  it('preserves the error payload and HTTP status', async () => {
    const response = Response.json(
      { error: { code: 'AUTH-001', message: '인증에 실패했습니다.' } },
      { status: 401, statusText: 'Unauthorized' },
    );

    await expect(ensureResponseOk(response)).rejects.toMatchObject({
      error: { code: 'AUTH-001', message: '인증에 실패했습니다.' },
      status: 401,
      statusText: 'Unauthorized',
      body: { error: { code: 'AUTH-001', message: '인증에 실패했습니다.' } },
    });
  });

  it('preserves HTTP status when an error body is not valid JSON', async () => {
    const response = new Response('upstream failure', {
      status: 502,
      statusText: 'Bad Gateway',
    });

    await expect(parseJsonResponse(response)).rejects.toMatchObject({
      status: 502,
      statusText: 'Bad Gateway',
      body: undefined,
    });
  });

  it('does not allow response body fields to overwrite Error fields', async () => {
    const body = {
      name: 'ExternalError',
      message: '외부 메시지',
      error: { code: 'AUTH-001', message: '인증에 실패했습니다.' },
    };
    const response = Response.json(body, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(ensureResponseOk(response)).rejects.toMatchObject({
      name: 'ApiResponseError',
      message: 'HTTP 500 Internal Server Error',
      error: body.error,
      body,
    });
  });
});
