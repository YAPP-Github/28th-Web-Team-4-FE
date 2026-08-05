import { signup } from '@/shared/api/generated';

import { submitSignup } from './submit-signup';

vi.mock('@/shared/api/generated', () => ({
  signup: vi.fn<typeof signup>(),
}));

const signupMock = vi.mocked(signup);
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
      data: { success: true },
      response: new Response(null, { status: 201 }),
    });

    await expect(submitSignup({ method: 'email', body })).resolves.toBeUndefined();
    expect(signupMock).toHaveBeenCalledWith({
      body,
      throwOnError: true,
    });
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
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/signup/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });
});
