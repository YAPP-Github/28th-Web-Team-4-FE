import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import type { ChannelComparisonItemResponse } from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';

import { useChannelComparison } from './use-channel-comparison';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

function createComparisonItem(
  channelId: string,
  overrides: Partial<ChannelComparisonItemResponse> = {},
): ChannelComparisonItemResponse {
  return {
    channelId,
    channelName: `${channelId} 채널`,
    iconUrl: null,
    audienceSummary: '20~40대',
    adFormats: ['배너'],
    targetingMethods: ['관심사'],
    minBudgetWon: 200_000,
    advantages: ['장점'],
    tags: ['태그'],
    cpcWon: 320,
    cpmWon: 4_800,
    matchRate: 90,
    estImpressions: { min: 10_000, max: 20_000 },
    estClicks: { min: 100, max: 200 },
    ...overrides,
  };
}

function comparisonResponse(items: readonly ChannelComparisonItemResponse[]) {
  return HttpResponse.json({
    success: true,
    data: { items },
    error: null,
    code: null,
  });
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

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

type HookProps = {
  channelIds: readonly string[];
  onboardingId: string | null;
};

describe('useChannelComparison', () => {
  it('유효한 채널 ID와 선택적 onboardingId로 비교 결과를 조회한다', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return comparisonResponse([
          createComparisonItem('channel-a'),
          createComparisonItem('channel-b'),
        ]);
      }),
    );

    const { result } = renderHook(
      () =>
        useChannelComparison({
          channelIds: ['channel-a', 'channel-b'],
          onboardingId: 'onboarding-87',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toHaveLength(2));

    expect(requestedUrl?.searchParams.getAll('channelIds')).toEqual(['channel-a', 'channel-b']);
    expect(requestedUrl?.searchParams.get('onboardingId')).toBe('onboarding-87');
    expect(result.current.data?.map(({ id }) => id)).toEqual(['channel-a', 'channel-b']);
  });

  it('최초 요청이 끝나기 전에는 데이터 없는 pending 상태를 반환한다', () => {
    const responseGate = createDeferred<void>();

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, async () => {
        await responseGate.promise;
        return comparisonResponse([
          createComparisonItem('channel-a'),
          createComparisonItem('channel-b'),
        ]);
      }),
    );

    const { result } = renderHook(
      () =>
        useChannelComparison({
          channelIds: ['channel-a', 'channel-b'],
          onboardingId: null,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('최초 조회 실패 시 데이터 없는 오류 상태를 반환한다', async () => {
    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, () =>
        HttpResponse.json({ success: false }, { status: 500 }),
      ),
    );

    const { result } = renderHook(
      () =>
        useChannelComparison({
          channelIds: ['channel-a', 'channel-b'],
          onboardingId: null,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });

  it('query key 변경 중에는 이전 성공 데이터를 유지한다', async () => {
    const nextResponseGate = createDeferred<void>();

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, async ({ request }) => {
        const channelIds = new URL(request.url).searchParams.getAll('channelIds');

        if (channelIds.includes('channel-c')) {
          await nextResponseGate.promise;
        }

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    const initialProps: HookProps = {
      channelIds: ['channel-a', 'channel-b'],
      onboardingId: null,
    };
    const { result, rerender } = renderHook((props: HookProps) => useChannelComparison(props), {
      initialProps,
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.data?.map(({ id }) => id)).toEqual(['channel-a', 'channel-b']),
    );

    rerender({ ...initialProps, channelIds: ['channel-a', 'channel-c'] });

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true));
    expect(result.current.data?.map(({ id }) => id)).toEqual(['channel-a', 'channel-b']);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isFetching).toBe(true);

    nextResponseGate.resolve();

    await waitFor(() =>
      expect(result.current.data?.map(({ id }) => id)).toEqual(['channel-a', 'channel-c']),
    );
    expect(result.current.isPlaceholderData).toBe(false);
  });
});
