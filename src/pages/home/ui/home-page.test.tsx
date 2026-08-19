import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';

import { HomePage } from './home-page';

beforeAll(() => {
  if (typeof window !== 'undefined') {
    window.IntersectionObserver = class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof window.IntersectionObserver;
  }
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn<() => void>(), refresh: vi.fn<() => void>() }),
}));

function renderHomePage(authenticated = false) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(
    authSessionQueryKey,
    authenticated
      ? { authenticated: true, accessTokenExpiresAt: Date.now() + 10_000 }
      : { authenticated: false },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders the public marketing landing content when not logged in', () => {
    renderHomePage(false);

    expect(screen.getByText('Find your channel, Fuel your growth')).toBeInTheDocument();
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toHaveTextContent('내게 맞는 광고 채널을 한눈에!');
    expect(heroHeading).toHaveTextContent('광고 채널 고민, 여기서 끝내 보세요');
    expect(screen.getByText('3초 만에 시작하기')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3초 만에 시작하기' })).toHaveAttribute(
      'href',
      '/recommend',
    );
    expect(screen.getByRole('button', { name: '바로 채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend',
    );
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend',
    );
    expect(screen.getByText('© 2026 CHAESOZIP. ALL RIGHTS RESERVED')).toBeInTheDocument();
    expect(screen.getByText('개인정보 처리방침')).toBeInTheDocument();
  });

  it('renders the personalized service finder when logged in', () => {
    renderHomePage(true);

    expect(screen.getByText('FIND YOUR FIT')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('광고하고 싶은 서비스의 이름을 입력해 보세요'),
    ).toBeInTheDocument();
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '바로 채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend',
    );
  });
});
