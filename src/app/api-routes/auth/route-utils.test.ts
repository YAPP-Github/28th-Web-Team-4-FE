import { isTrustedMutation, upstreamErrorResponse } from './route-utils';

describe('auth BFF mutation origin checks', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('accepts a same-origin browser request', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: {
        origin: 'https://chaeso-zip.com',
        'sec-fetch-site': 'same-origin',
      },
    });

    expect(isTrustedMutation(request)).toBe(true);
  });

  it('accepts an allowed public origin when the request URL uses an internal host', () => {
    const request = new Request('https://internal-next-service/api/auth/login', {
      headers: {
        origin: 'https://chaeso-zip.com',
        'sec-fetch-site': 'same-origin',
      },
    });

    expect(isTrustedMutation(request)).toBe(true);
  });

  it('rejects a mismatched origin', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: {
        origin: 'https://attacker.example',
        'sec-fetch-site': 'same-origin',
      },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });

  it('accepts a browser request with a none fetch site', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: { 'sec-fetch-site': 'none' },
    });

    expect(isTrustedMutation(request)).toBe(true);
  });

  it('rejects a same-site fetch', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: {
        origin: 'https://chaeso-zip.com',
        'sec-fetch-site': 'same-site',
      },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });

  it('rejects a cross-site fetch even without an Origin header', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: { 'sec-fetch-site': 'cross-site' },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });

  it('rejects a request without a fetch site header', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: { origin: 'https://chaeso-zip.com' },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });
});

describe('auth BFF upstream errors', () => {
  it('preserves a valid upstream error payload', async () => {
    const error = {
      success: false,
      error: {
        code: 'AUTH-001',
        message: '인증 정보가 올바르지 않습니다.',
        fieldErrors: [],
      },
    };

    const response = upstreamErrorResponse(error, 401);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual(error);
  });

  it.each([{ success: false }, { success: false, error: null }])(
    'returns the BFF fallback for a malformed upstream error',
    async (error) => {
      const response = upstreamErrorResponse(error, 401);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        success: false,
        error: {
          code: 'BFF-002',
          message: '인증 서버 요청 중 문제가 발생했습니다.',
          fieldErrors: [],
        },
      });
    },
  );
});
