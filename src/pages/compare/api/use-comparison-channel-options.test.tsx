import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useComparisonChannelOptions } from './use-comparison-channel-options';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

type HookParams = Parameters<typeof useComparisonChannelOptions>[0];

function renderOptionsHook(overrides: Partial<HookParams> = {}) {
  const params: HookParams = {
    onboardingId: null,
    open: true,
    searchKeyword: '',
    selectedChannelIds: [],
    ...overrides,
  };

  return renderHook(() => useComparisonChannelOptions(params), { wrapper: createWrapper() });
}

function channelsResponse(channels: readonly { id: string; name: string }[]) {
  return HttpResponse.json({
    success: true,
    data: {
      content: channels,
      number: 0,
      size: channels.length,
      totalElements: channels.length,
      totalPages: channels.length > 0 ? 1 : 0,
      first: true,
      last: true,
    },
    error: null,
    code: null,
  });
}

function recommendationsResponse(channelIds: readonly string[]) {
  return HttpResponse.json({
    success: true,
    data: channelIds.map((channelId) => ({
      channelId,
      channelName: CHANNELS.find(({ id }) => id === channelId)?.name ?? channelId,
    })),
    error: null,
    code: null,
  });
}

const CHANNELS = [
  { id: 'channel-c', name: 'Charlie' },
  { id: 'channel-a', name: 'Alpha' },
  { id: 'channel-b', name: 'Bravo' },
] as const;

describe('useComparisonChannelOptions', () => {
  it('picker가 닫혀 있으면 채널과 추천을 조회하지 않는다', () => {
    const channelsRequest = vi.fn<() => void>();
    const recommendationsRequest = vi.fn<() => void>();

    server.use(
      http.get(/\/api\/v1\/channels$/, () => {
        channelsRequest();
        return channelsResponse(CHANNELS);
      }),
      http.get(/\/api\/v1\/recommendations$/, () => {
        recommendationsRequest();
        return recommendationsResponse([]);
      }),
    );

    const { result } = renderOptionsHook({
      onboardingId: 'onboarding-87',
      open: false,
      searchKeyword: 'Alpha',
    });

    expect(result.current.isPending).toBe(false);
    expect(channelsRequest).not.toHaveBeenCalled();
    expect(recommendationsRequest).not.toHaveBeenCalled();
  });

  it('검색어가 없으면 채널 검색을 요청하지 않는다', () => {
    const channelsRequest = vi.fn<() => void>();
    const recommendationsRequest = vi.fn<() => void>();

    server.use(
      http.get(/\/api\/v1\/channels$/, () => {
        channelsRequest();
        return channelsResponse(CHANNELS);
      }),
      http.get(/\/api\/v1\/recommendations$/, () => {
        recommendationsRequest();
        return recommendationsResponse([]);
      }),
    );

    const { result } = renderOptionsHook({ selectedChannelIds: ['channel-a'] });

    expect(channelsRequest).not.toHaveBeenCalled();
    expect(recommendationsRequest).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it('앞뒤 공백을 제거한 검색어로 채널을 조회한다', async () => {
    let requestedSearchKeyword: string | null | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        requestedSearchKeyword = new URL(request.url).searchParams.get('name');
        return channelsResponse([CHANNELS[2]]);
      }),
    );

    const { result } = renderOptionsHook({ searchKeyword: '  Bravo  ' });

    await waitFor(() => expect(result.current.options).toHaveLength(1));

    expect(requestedSearchKeyword).toBe('Bravo');
  });

  it('onboardingId가 있으면 추천을 함께 조회해 추천 채널을 먼저 표시한다', async () => {
    let requestedOnboardingId: string | null | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, () => channelsResponse(CHANNELS)),
      http.get(/\/api\/v1\/recommendations$/, ({ request }) => {
        requestedOnboardingId = new URL(request.url).searchParams.get('onboardingId');
        return recommendationsResponse(['channel-c']);
      }),
    );

    const { result } = renderOptionsHook({
      onboardingId: 'onboarding-87',
      searchKeyword: 'a',
      selectedChannelIds: ['channel-a'],
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(requestedOnboardingId).toBe('onboarding-87');
    expect(result.current.options.map(({ id, isRecommended }) => ({ id, isRecommended }))).toEqual([
      { id: 'channel-c', isRecommended: true },
      { id: 'channel-a', isRecommended: false },
      { id: 'channel-b', isRecommended: false },
    ]);
  });

  it('추천 조회가 실패하면 일반 채널 목록으로 대체한다', async () => {
    server.use(
      http.get(/\/api\/v1\/channels$/, () => channelsResponse(CHANNELS)),
      http.get(/\/api\/v1\/recommendations$/, () =>
        HttpResponse.json({ success: false }, { status: 500 }),
      ),
    );

    const { result } = renderOptionsHook({
      onboardingId: 'onboarding-87',
      searchKeyword: 'a',
    });

    await waitFor(() => expect(result.current.options).toHaveLength(3));
    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.options.every((option) => !option.isRecommended)).toBe(true);
  });

  it('채널 목록 조회 실패만 오류로 전달한다', async () => {
    server.use(
      http.get(/\/api\/v1\/channels$/, () =>
        HttpResponse.json({ success: false }, { status: 500 }),
      ),
      http.get(/\/api\/v1\/recommendations$/, () => recommendationsResponse(['channel-c'])),
    );

    const { result } = renderOptionsHook({
      onboardingId: 'onboarding-87',
      searchKeyword: 'a',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isPending).toBe(false);
  });
});
