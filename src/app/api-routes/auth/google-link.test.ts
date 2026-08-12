import { linkGoogle } from '@/shared/api/generated';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';

import { postGoogleLink } from './google-link';

vi.mock('@/shared/api/generated', () => ({
  linkGoogle: vi.fn<typeof linkGoogle>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  writeAuthSession: vi.fn<typeof writeAuthSession>(),
}));

const linkGoogleMock = vi.mocked(linkGoogle);
const writeAuthSessionMock = vi.mocked(writeAuthSession);
const tokens = {
  accessToken: 'access-token',
  accessTokenExpiresIn: 1_800,
  refreshToken: 'refresh-token',
  refreshTokenExpiresIn: 7_200,
};

function googleLinkRequest(
  body: unknown = { idToken: 'google-id-token' },
  headers: Record<string, string> = {},
): Request {
  return new Request('https://chaeso-zip.com/api/auth/google/link', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://chaeso-zip.com',
      'sec-fetch-site': 'same-origin',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function successResponse(): Awaited<ReturnType<typeof linkGoogle>> {
  return {
    data: { success: true, data: tokens, error: null, code: null },
    response: new Response(null, { status: 200 }),
  };
}

function errorResponse(status: number): Awaited<ReturnType<typeof linkGoogle>> {
  return {
    data: undefined,
    error: {
      success: false,
      data: null,
      error: { code: 'AUTH-009', message: '계정 연결에 실패했습니다.', fieldErrors: [] },
      code: null,
    },
    response: new Response(null, { status }),
  };
}

describe('Google account link BFF', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
    vi.clearAllMocks();
    linkGoogleMock.mockResolvedValue(successResponse());
    writeAuthSessionMock.mockResolvedValue({
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: 1_800_000,
      refreshToken: tokens.refreshToken,
      refreshTokenExpiresAt: 7_200_000,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('links the account and stores the newly issued session', async () => {
    const response = await postGoogleLink(googleLinkRequest());

    expect(response.status).toBe(204);
    expect(linkGoogleMock).toHaveBeenCalledWith({ body: { idToken: 'google-id-token' } });
    expect(writeAuthSessionMock).toHaveBeenCalledWith(tokens);
  });

  it('rejects cross-origin mutations before calling the backend', async () => {
    const response = await postGoogleLink(
      googleLinkRequest(undefined, {
        origin: 'https://attacker.example',
        'sec-fetch-site': 'cross-site',
      }),
    );

    expect(response.status).toBe(403);
    expect(linkGoogleMock).not.toHaveBeenCalled();
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });

  it.each([{}, { idToken: '' }, { idToken: 123 }])(
    'rejects an invalid request body without calling the backend: %o',
    async (body) => {
      const response = await postGoogleLink(googleLinkRequest(body));

      expect(response.status).toBe(400);
      expect(linkGoogleMock).not.toHaveBeenCalled();
      expect(writeAuthSessionMock).not.toHaveBeenCalled();
    },
  );

  it('forwards the backend error without replacing the current session', async () => {
    linkGoogleMock.mockResolvedValue(errorResponse(409));

    const response = await postGoogleLink(googleLinkRequest());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      success: false,
      data: null,
      error: {
        code: 'AUTH-009',
        message: '계정 연결에 실패했습니다.',
        fieldErrors: [],
      },
      code: null,
    });
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed successful response without replacing the current session', async () => {
    const malformedResponse = {
      data: {
        success: true,
        data: { code: 'GOOGLE_ACCOUNT_LINKED' },
        error: null,
        code: null,
      },
      response: new Response(null, { status: 200 }),
    } as unknown as Awaited<ReturnType<typeof linkGoogle>>;
    linkGoogleMock.mockResolvedValue(malformedResponse);

    const response = await postGoogleLink(googleLinkRequest());

    expect(response.status).toBe(502);
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });
});
