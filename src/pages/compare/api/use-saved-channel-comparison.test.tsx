import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useSavedChannelComparison } from './use-saved-channel-comparison';

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

describe('useSavedChannelComparison', () => {
  it('requests a saved channel comparison by id', async () => {
    let requestedPath: string | undefined;

    server.use(
      http.get(/\/api\/v1\/channel-comparisons\/comparison-1$/, ({ request }) => {
        requestedPath = new URL(request.url).pathname;

        return HttpResponse.json({
          success: true,
          data: {
            comparisonId: 'comparison-1',
            items: [],
          },
          error: null,
          code: null,
        });
      }),
    );

    const { result } = renderHook(() => useSavedChannelComparison('comparison-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data?.data.comparisonId).toBe('comparison-1'));

    expect(requestedPath).toBe('/api/v1/channel-comparisons/comparison-1');
  });
});
