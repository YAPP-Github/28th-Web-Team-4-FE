import { redirect } from 'next/navigation';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

import { ProtectedLayout } from './protected-layout';

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

describe('ProtectedLayout', () => {
  it('renders protected content for authenticated users', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    await expect(ProtectedLayout({ children: <p>마이페이지</p> })).resolves.toEqual(
      <p>마이페이지</p>,
    );
  });

  it('redirects guests to login', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(false);

    await expect(ProtectedLayout({ children: <p>마이페이지</p> })).rejects.toThrow(
      'REDIRECT:/login',
    );
    expect(redirectMock).toHaveBeenCalledWith('/login');
  });
});
