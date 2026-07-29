import { signup } from '@/shared/api/generated';

import { submitSignup } from './submit-signup';

vi.mock('@/shared/api/generated', () => ({
  signup: vi.fn<typeof signup>(),
}));

const signupMock = vi.mocked(signup);

describe('submitSignup', () => {
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

    await expect(submitSignup(body)).resolves.toBeUndefined();
    expect(signupMock).toHaveBeenCalledWith({
      body,
      throwOnError: true,
    });
  });
});
