import { redirect } from 'next/navigation';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

import { AuthLayout } from './auth-layout';

vi.mock('@/shared/lib/auth/session-cookie', () => ({
  hasActiveAuthSession: vi.fn<() => Promise<boolean>>(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn<(destination: string) => never>((destination) => {
    throw new Error(`REDIRECT:${destination}`);
  }),
}));

const hasActiveAuthSessionMock = vi.mocked(hasActiveAuthSession);
const redirectMock = vi.mocked(redirect);

describe('AuthLayout', () => {
  it('renders auth pages for guests', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(false);

    await expect(AuthLayout({ children: <p>로그인</p> })).resolves.toEqual(
      expect.objectContaining({ type: 'main' }),
    );
  });

  it('redirects authenticated users home', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    await expect(AuthLayout({ children: <p>로그인</p> })).rejects.toThrow('REDIRECT:/');
    expect(redirectMock).toHaveBeenCalledWith('/');
  });
});
