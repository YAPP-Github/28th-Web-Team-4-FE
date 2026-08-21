import { login, signup } from '@/shared/api/generated';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';

import { postSignup } from './signup';

vi.mock('@/shared/api/generated', () => ({
  login: vi.fn<typeof login>(),
  signup: vi.fn<typeof signup>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  writeAuthSession: vi.fn<typeof writeAuthSession>(),
}));

const signupMock = vi.mocked(signup);
const loginMock = vi.mocked(login);
const writeAuthSessionMock = vi.mocked(writeAuthSession);
const tokens = {
  accessToken: 'access-token',
  accessTokenExpiresIn: 1_800,
  refreshToken: 'refresh-token',
  refreshTokenExpiresIn: 7_200,
};

function signupRequest(
  body: unknown = {
    email: 'new@example.com',
    password: 'Password1!',
    nickname: '채소러버',
    companyName: '채소컴퍼니',
    occupation: 'DEVELOPMENT',
    termsAgreed: true,
    marketingAgreed: false,
  },
  headers: Record<string, string> = {},
): Request {
  return new Request('https://chaeso-zip.com/api/auth/signup', {
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

function successResponse(): Awaited<ReturnType<typeof signup>> {
  return {
    data: { success: true, data: tokens, error: null, code: null },
    response: new Response(null, { status: 201 }),
  } as unknown as Awaited<ReturnType<typeof signup>>;
}

function errorResponse(status: number): Awaited<ReturnType<typeof signup>> {
  return {
    data: undefined,
    error: {
      success: false,
      data: null,
      error: { code: 'AUTH-002', message: '이미 사용 중인 이메일입니다.', fieldErrors: [] },
      code: null,
    },
    response: new Response(null, { status }),
  } as unknown as Awaited<ReturnType<typeof signup>>;
}

function loginSuccessResponse(): Awaited<ReturnType<typeof login>> {
  return {
    data: { success: true, data: tokens, error: null, code: null },
    response: new Response(null, { status: 200 }),
  } as unknown as Awaited<ReturnType<typeof login>>;
}

function loginErrorResponse(status: number): Awaited<ReturnType<typeof login>> {
  return {
    data: undefined,
    error: {
      success: false,
      data: null,
      error: { code: 'AUTH-004', message: '로그인에 실패했습니다.', fieldErrors: [] },
      code: null,
    },
    response: new Response(null, { status }),
  } as unknown as Awaited<ReturnType<typeof login>>;
}

describe('email signup BFF', () => {
  beforeEach(() => {
    vi.stubEnv('BFF_ALLOWED_ORIGINS', 'https://chaeso-zip.com,http://localhost:3000');
    vi.clearAllMocks();
    signupMock.mockResolvedValue(successResponse());
    loginMock.mockResolvedValue(loginSuccessResponse());
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

  it('stores the issued session and does not expose signup response data', async () => {
    const response = await postSignup(signupRequest());

    expect(response.status).toBe(204);
    expect(signupMock).toHaveBeenCalledWith({
      body: {
        email: 'new@example.com',
        password: 'Password1!',
        nickname: '채소러버',
        companyName: '채소컴퍼니',
        occupation: 'DEVELOPMENT',
        termsAgreed: true,
        marketingAgreed: false,
      },
    });
    expect(writeAuthSessionMock).toHaveBeenCalledWith(tokens);
  });

  it('rejects cross-origin mutations before calling the backend', async () => {
    const response = await postSignup(
      signupRequest(undefined, {
        origin: 'https://attacker.example',
        'sec-fetch-site': 'cross-site',
      }),
    );

    expect(response.status).toBe(403);
    expect(signupMock).not.toHaveBeenCalled();
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });

  it.each([{}, { email: 'invalid-email' }, { password: '' }, { termsAgreed: 'true' }])(
    'rejects an invalid request body without calling the backend: %o',
    async (body) => {
      const response = await postSignup(signupRequest(body));

      expect(response.status).toBe(400);
      expect(signupMock).not.toHaveBeenCalled();
      expect(writeAuthSessionMock).not.toHaveBeenCalled();
    },
  );

  it('forwards the backend error without replacing the session', async () => {
    signupMock.mockResolvedValue(errorResponse(409));

    const response = await postSignup(signupRequest());

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      success: false,
      data: null,
      error: {
        code: 'AUTH-002',
        message: '이미 사용 중인 이메일입니다.',
        fieldErrors: [],
      },
      code: null,
    });
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });

  it('creates a session with a BFF-only login when signup returns user data', async () => {
    signupMock.mockResolvedValue({
      data: {
        success: true,
        data: { id: 'user-1', email: 'new@example.com', nickname: '채소러버' },
        error: null,
        code: null,
      },
      response: new Response(null, { status: 201 }),
    });

    const response = await postSignup(signupRequest());

    expect(response.status).toBe(204);
    expect(loginMock).toHaveBeenCalledWith({
      body: { email: 'new@example.com', password: 'Password1!' },
    });
    expect(writeAuthSessionMock).toHaveBeenCalledWith(tokens);
  });

  it('forwards the BFF-only login error without replacing the session', async () => {
    signupMock.mockResolvedValue({
      data: {
        success: true,
        data: { id: 'user-1', email: 'new@example.com', nickname: '채소러버' },
        error: null,
        code: null,
      },
      response: new Response(null, { status: 201 }),
    });
    loginMock.mockResolvedValue(loginErrorResponse(401));

    const response = await postSignup(signupRequest());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      data: null,
      error: {
        code: 'AUTH-004',
        message: '로그인에 실패했습니다.',
        fieldErrors: [],
      },
      code: null,
    });
    expect(writeAuthSessionMock).not.toHaveBeenCalled();
  });
});
