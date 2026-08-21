import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { SavedResultsPageWithRecommendations } from './saved-results-page-with-recommendations';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function savedResultPage(kind: string, page: number) {
  return {
    success: true,
    data: {
      content: [
        {
          id: `${kind}-${page}`,
          serviceName: `${kind} 결과 ${page + 1}`,
          createdAt: '2026-08-19T10:30:00Z',
          channelNames: ['네이버 검색광고'],
        },
      ],
      number: page,
      size: 5,
      totalElements: 6,
      totalPages: 2,
      first: page === 0,
      last: page === 1,
    },
    error: null,
    code: null,
  };
}

describe('SavedResultsPageWithRecommendations', () => {
  it('requests and renders each saved result API by tab', async () => {
    const requestedUrls: string[] = [];

    server.use(
      http.get(/\/api\/v1\/recommendations\/my$/, ({ request }) => {
        const url = new URL(request.url);
        requestedUrls.push(`${url.pathname}${url.search}`);
        const page = url.searchParams.get('page') ?? '0';
        return HttpResponse.json(savedResultPage('recommendation', Number(page)));
      }),
      http.get(/\/api\/v1\/channel-comparisons\/my$/, ({ request }) => {
        const url = new URL(request.url);
        requestedUrls.push(`${url.pathname}${url.search}`);
        const page = url.searchParams.get('page') ?? '0';
        return HttpResponse.json(savedResultPage('comparison', Number(page)));
      }),
      http.get(/\/api\/v1\/simulations$/, ({ request }) => {
        const url = new URL(request.url);
        requestedUrls.push(`${url.pathname}${url.search}`);
        const page = url.searchParams.get('page') ?? '0';
        return HttpResponse.json(savedResultPage('simulation', Number(page)));
      }),
    );

    const user = userEvent.setup();
    render(<SavedResultsPageWithRecommendations isLoggedIn />, { wrapper: createWrapper() });

    expect(await screen.findByRole('link', { name: /recommendation 결과 1/ })).toHaveAttribute(
      'href',
      '/recommend/saved/recommendation-0',
    );
    expect(requestedUrls).toEqual(
      expect.arrayContaining([
        '/api/v1/recommendations/my?page=0&size=5',
        '/api/v1/channel-comparisons/my?page=0&size=5',
        '/api/v1/simulations?page=0&size=5',
      ]),
    );

    await user.click(screen.getByRole('tab', { name: '채널 비교' }));
    expect(await screen.findByRole('heading', { name: 'comparison 결과 1' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '페이지 2' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'comparison 결과 2' })).toBeVisible();
    });
    expect(requestedUrls).toContain('/api/v1/channel-comparisons/my?page=1&size=5');

    await user.click(screen.getByRole('tab', { name: '예산 시뮬레이션' }));
    expect(
      await screen.findByRole('link', { name: /simulation 결과 1 저장된 시뮬레이션 결과/ }),
    ).toHaveAttribute('href', '/simulator/saved/simulation-0');
  });
});
