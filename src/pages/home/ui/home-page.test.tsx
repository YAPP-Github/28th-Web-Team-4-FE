import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';

import { HomePage } from './home-page';

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

    expect(
      screen.getByRole('heading', { name: '내 서비스에 딱 맞는 광고 채널 찾기' }),
    ).toBeInTheDocument();
    expect(screen.getByText('질문 몇 가지로 광고 채널 선택의 기준을 세워요')).toBeInTheDocument();
    expect(
      screen.getByText('추천 결과는 실행 판단에 필요한 지표까지 포함해요'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('필요한 순간에 맞춰 추천, 비교, 시뮬레이션을 따로 살펴봐요'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('무료로 시작하기')).toHaveLength(2);
    expect(screen.getByText('내게 맞는 광고 채널을 한눈에! 채소집')).toBeInTheDocument();
  });
});
