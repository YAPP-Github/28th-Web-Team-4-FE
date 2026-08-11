import { signup } from '@/shared/api/generated';
import { authenticateLocal } from '@/shared/api/authenticate-local';

import { submitSignup } from './submit-signup';

vi.mock('@/shared/api/generated', () => ({
  signup: vi.fn<typeof signup>(),
}));

vi.mock('@/shared/api/authenticate-local', () => ({
  authenticateLocal: vi.fn<typeof authenticateLocal>(),
}));

const signupMock = vi.mocked(signup);
const authenticateLocalMock = vi.mocked(authenticateLocal);
const fetchMock = vi.fn<typeof fetch>();

describe('submitSignup', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submits the completed signup draft', async () => {
    const body = {
      email: 'new@example.com',
      password: 'Password1!',
      nickname: '채소러버',
      companyName: '채소컴퍼니',
      occupation: 'DEVELOPMENT',
      termsAgreed: true,
      marketingAgreed: false,
    } as const;
    signupMock.mockResolvedValue({
      data: {
        success: true,
        data: { id: 'user-1', email: body.email, nickname: body.nickname },
        error: null,
        code: null,
      },
      response: new Response(null, { status: 201 }),
    });
    authenticateLocalMock.mockResolvedValue();

    await expect(submitSignup({ method: 'email', body })).resolves.toBeUndefined();
    expect(signupMock).toHaveBeenCalledWith({
      body,
      throwOnError: true,
    });
    expect(authenticateLocalMock).toHaveBeenCalledWith(body.email, body.password);
  });

  it('submits a completed Google signup draft', async () => {
    const body = {
      signupToken: 'one-time-token',
      nickname: '구글 사용자',
      companyName: '채소컴퍼니',
      occupation: 'DESIGN',
      termsAgreed: true,
      marketingAgreed: false,
    } as const;
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(submitSignup({ method: 'google', body })).resolves.toBeUndefined();
    expect(authenticateLocalMock).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/signup/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });
});
