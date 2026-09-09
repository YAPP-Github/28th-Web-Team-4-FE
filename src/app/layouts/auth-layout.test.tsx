import { redirect } from 'next/navigation';
import { render, screen } from '@testing-library/react';

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

    render(await AuthLayout({ children: <p>로그인</p> }));

    expect(screen.getByRole('main')).toHaveTextContent('로그인');
  });

  it('redirects authenticated users home', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    await expect(AuthLayout({ children: <p>로그인</p> })).rejects.toThrow('REDIRECT:/');
    expect(redirectMock).toHaveBeenCalledWith('/');
  });
});
