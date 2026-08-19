import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';

import { HomePage } from './home-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn<() => void>() }),
}));

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

    expect(screen.getByText('FIND YOUR FIT')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('광고하고 싶은 서비스의 이름을 입력해 보세요'),
    ).toBeInTheDocument();
    expect(screen.getByText('자주 묻는 질문')).toBeInTheDocument();
    expect(screen.getByText('© 2026 CHAESOZIP. ALL RIGHTS RESERVED')).toBeInTheDocument();
    expect(screen.getByText('개인정보 처리방침')).toBeInTheDocument();
  });
});
