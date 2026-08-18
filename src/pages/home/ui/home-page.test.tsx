import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

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

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(authSessionQueryKey, { authenticated: false });

  return render(
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders the marketing landing content', () => {
    renderHomePage();

    expect(screen.getByText('Find your channel, Fuel your growth')).toBeInTheDocument();
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toHaveTextContent('내게 맞는 광고 채널을 한눈에!');
    expect(heroHeading).toHaveTextContent('광고 채널 고민, 여기서 끝내 보세요');
    expect(screen.getByText('채소집에서 바로 비교하는 국내외 주요 광고 매체')).toBeInTheDocument();
    expect(screen.getByText('채소집 제공 채널 수')).toBeInTheDocument();
    expect(screen.getByText('무료로 시작하기')).toBeInTheDocument();
    expect(screen.getByText('내게 맞는 광고 채널을 한눈에! 채소집')).toBeInTheDocument();
  });
});
