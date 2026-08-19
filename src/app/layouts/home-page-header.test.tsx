import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';

import { HomePageHeader } from './home-page-header';

type ProfileQueryResult = {
  data?: { nickname?: string };
};

const { useMyProfileMock } = vi.hoisted(() => ({
  useMyProfileMock: vi.fn<(options?: { enabled?: boolean }) => ProfileQueryResult>(),
}));

vi.mock('@/features/auth/session/api/auth-session', () => ({
  getAuthSession: vi.fn<() => Promise<unknown>>(() => new Promise(() => undefined)),
  logoutAuthSession: vi.fn<() => Promise<void>>(),
}));

vi.mock('@/pages/mypage/api/use-my-profile', () => ({
  useMyProfile: useMyProfileMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn<(href: string) => void>(),
    refresh: vi.fn<() => void>(),
  }),
  useSelectedLayoutSegment: () => null,
}));

function renderHeader(authenticated: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY } },
  });
  queryClient.setQueryData(
    authSessionQueryKey,
    authenticated
      ? { authenticated: true, accessTokenExpiresAt: Date.now() + 60_000 }
      : { authenticated: false },
  );

  render(
    <QueryClientProvider client={queryClient}>
      <HomePageHeader />
    </QueryClientProvider>,
  );
}

describe('HomePageHeader', () => {
  beforeEach(() => {
    useHeroHeaderToneStore.getState().reset();
    useMyProfileMock.mockReset();
    useMyProfileMock.mockReturnValue({ data: { nickname: '채소집' } });
  });

  it('keeps the logged-in home header on the default white style', () => {
    useHeroHeaderToneStore.setState({ progress: 1, theme: 'orange' });

    renderHeader(true);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-surface-lowest');
    expect(header).toHaveClass('border-outline-low');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
    expect(header).toHaveClass('z-50');
    expect(header).not.toHaveClass('bg-sys-primary-default');
    expect(header).not.toHaveClass('border-transparent');
    expect(screen.getByText('채소집 님')).toBeVisible();
  });

  it('keeps the public home header connected to the hero tone', () => {
    useHeroHeaderToneStore.setState({ progress: 1, theme: 'orange' });

    renderHeader(false);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-sys-primary-default');
    expect(header).toHaveClass('border-transparent');
    expect(screen.getByRole('button', { name: '시작하기' })).toBeVisible();
  });
});
