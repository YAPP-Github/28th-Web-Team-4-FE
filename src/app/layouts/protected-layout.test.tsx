import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

import { ProtectedLayout } from './protected-layout';

vi.mock('@/shared/lib/auth/session-cookie', () => ({
  hasActiveAuthSession: vi.fn<() => Promise<boolean>>(),
}));

const hasActiveAuthSessionMock = vi.mocked(hasActiveAuthSession);

describe('ProtectedLayout', () => {
  it('renders protected content for authenticated users', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    await expect(ProtectedLayout({ children: <p>마이페이지</p> })).resolves.toEqual(
      <p>마이페이지</p>,
    );
  });

  it('redirects guests to login', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(false);

    await expect(ProtectedLayout({ children: <p>마이페이지</p> })).rejects.toSatisfy(
      isRedirectError,
    );
  });
});
