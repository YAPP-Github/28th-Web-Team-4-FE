import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useSavedRecommendation } from './use-saved-recommendation';

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

describe('useSavedRecommendation', () => {
  it('requests a saved recommendation by id', async () => {
    let requestedPath: string | undefined;

    server.use(
      http.get(/\/api\/v1\/recommendations\/recommendation-1$/, ({ request }) => {
        requestedPath = new URL(request.url).pathname;

        return HttpResponse.json({
          success: true,
          data: [],
          error: null,
          code: null,
        });
      }),
    );

    const { result } = renderHook(() => useSavedRecommendation('recommendation-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.data).toEqual([]));

    expect(requestedPath).toBe('/api/v1/recommendations/recommendation-1');
  });
});
