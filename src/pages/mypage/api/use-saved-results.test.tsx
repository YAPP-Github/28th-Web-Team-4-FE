import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useMyChannelComparisons } from './use-my-channel-comparisons';
import { useMySimulations } from './use-my-simulations';

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

describe('saved result queries', () => {
  it('requests and maps saved channel comparisons', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channel-comparisons\/my$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json({
          success: true,
          data: {
            content: [
              {
                id: 'comparison-1',
                serviceName: '채소집',
                createdAt: '2026-08-18T10:30:00Z',
                channelNames: ['네이버 검색광고'],
              },
            ],
            number: 0,
            size: 3,
            totalElements: 1,
            totalPages: 1,
            first: true,
            last: true,
          },
          error: null,
          code: null,
        });
      }),
    );

    const { result } = renderHook(() => useMyChannelComparisons(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    expect(requestedUrl?.searchParams.get('page')).toBe('0');
    expect(requestedUrl?.searchParams.get('size')).toBe('3');
    expect(result.current.data?.[0]).toEqual({
      id: 'comparison-1',
      title: '채소집',
      savedAt: '2026년 8월 18일',
      channelNames: ['네이버 검색광고'],
    });
  });

  it('requests and maps saved simulations', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/simulations$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json({
          success: true,
          data: {
            content: [
              {
                id: 'simulation-1',
                serviceName: null,
                createdAt: '2026-08-17T10:30:00Z',
                channelNames: ['카카오모먼트'],
              },
            ],
            number: 0,
            size: 3,
            totalElements: 1,
            totalPages: 1,
            first: true,
            last: true,
          },
          error: null,
          code: null,
        });
      }),
    );

    const { result } = renderHook(() => useMySimulations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    expect(requestedUrl?.searchParams.get('page')).toBe('0');
    expect(requestedUrl?.searchParams.get('size')).toBe('3');
    expect(result.current.data?.[0]).toEqual({
      id: 'simulation-1',
      title: '예산 시뮬레이션',
      savedAt: '2026년 8월 17일',
      channelNames: ['카카오모먼트'],
    });
  });
});
