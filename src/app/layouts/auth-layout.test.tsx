import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

import { AuthLayout } from './auth-layout';

vi.mock('@/shared/lib/auth/session-cookie', () => ({
  hasActiveAuthSession: vi.fn<() => Promise<boolean>>(),
}));

const hasActiveAuthSessionMock = vi.mocked(hasActiveAuthSession);

describe('AuthLayout', () => {
  it('renders auth pages for guests', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(false);

    await expect(AuthLayout({ children: <p>로그인</p> })).resolves.toEqual(
      expect.objectContaining({ type: 'main' }),
    );
  });

  it('redirects authenticated users home', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    await expect(AuthLayout({ children: <p>로그인</p> })).rejects.toSatisfy(isRedirectError);
  });
});
