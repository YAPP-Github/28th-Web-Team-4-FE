import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { OverlayProvider } from 'overlay-kit';

import type { ChannelDetailResponse, ChannelListItemResponse } from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';
import { ChannelDetailContentSkeleton } from '@/features/channel-detail/ui/channel-detail-content-skeleton';

import { openChannelDetailModal } from './open-channel-detail-modal';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

const CHANNEL: ChannelListItemResponse = {
  id: 'channel-meta',
  name: '메타 광고',
  logoUrl: null,
  description: '목적에 맞는 정교한 타기팅 채널',
  primaryCategory: 'SHOPPING_COMMERCE',
};

function createDetailResponse(
  overrides: Partial<NonNullable<ChannelDetailResponse>> = {},
): NonNullable<ChannelDetailResponse> {
  return {
    id: CHANNEL.id,
    name: CHANNEL.name,
    logoUrl: null,
    tagline: '상세 API tagline',
    description: '메타 광고 상세 설명',
    primaryCategory: CHANNEL.primaryCategory,
    mediaType: 'SNS',
    suitableCategories: ['SHOPPING_COMMERCE'],
    ageBandCodes: ['AGE_20S', 'AGE_30S'],
    primaryAgeBand: '20~30대',
    primaryGender: 'ALL',
    audienceSummary: null,
    audienceTraits: null,
    advantages: ['높은 전환 효율'],
    minBudgetWon: 200_000,
    maxBudgetWon: null,
    executionType: 'SELF',
    adFormats: ['피드'],
    targetingMethods: ['관심사'],
    tags: [],
    products: [
      {
        id: 'product-feed',
        productName: '피드 광고',
        inventoryType: null,
        supportedObjectives: ['CONVERSION'],
        minBudgetWon: 200_000,
        maxBudgetWon: null,
        expectedImpressions: 100_000,
        expectedClicks: 1_200,
        expectedPeriod: null,
        pricing: [],
        isExecutable: null,
      },
    ],
    audienceMetrics: [
      {
        metricName: '월간 사용자',
        valueNumeric: 160_000,
        valueText: null,
        unit: '명',
        period: null,
      },
    ],
    references: ['브랜드 캠페인 A'],
    recommendationBasis: null,
    ...overrides,
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function OpenModalButton({
  fallback,
  onboardingId,
}: {
  fallback?: ReactNode;
  onboardingId?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        openChannelDetailModal({
          channel: CHANNEL,
          onboardingId,
          fallback: fallback ?? <ChannelDetailContentSkeleton />,
        });
      }}
    >
      상세보기
    </button>
  );
}

function renderOpenButton(fallback?: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <OpenModalButton fallback={fallback} />
      </OverlayProvider>
    </QueryClientProvider>,
  );
}

function renderOpenButtonWithOnboardingId(onboardingId: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <OpenModalButton onboardingId={onboardingId} />
      </OverlayProvider>
    </QueryClientProvider>,
  );
}

describe('openChannelDetailModal', () => {
  it('추천 결과 진입이면 상세 조회에 onboardingId를 전달한다', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channels\/[^/]+$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json({
          success: true,
          data: createDetailResponse({ tags: [' KPI 최적 ', '입문자 추천'] }),
        });
      }),
    );

    const user = userEvent.setup();
    renderOpenButtonWithOnboardingId('onboarding-87');

    await user.click(screen.getByRole('button', { name: '상세보기' }));
    expect(await screen.findByText('메타 광고 상세 설명')).toBeVisible();
    expect(await screen.findByText('상세 API tagline')).toBeVisible();
    expect(screen.getByRole('heading', { name: '이런 점이 좋아요' })).toBeVisible();
    expect(screen.getByText('KPI 최적')).toBeVisible();
    expect(screen.getByText('입문자 추천')).toBeVisible();
    expect(requestedUrl?.searchParams.get('onboardingId')).toBe('onboarding-87');
  });

  it('모달 셸과 주입한 fallback을 즉시 열고 상세 콘텐츠로 교체한다', async () => {
    const responseGate = createDeferred<void>();
    let requestedId: string | undefined;

    server.use(
      http.get(/\/api\/v1\/channels\/[^/]+$/, async ({ request }) => {
        requestedId = new URL(request.url).pathname.split('/').at(-1);
        await responseGate.promise;
        return HttpResponse.json({
          success: true,
          data: createDetailResponse(),
          error: null,
          code: null,
        });
      }),
    );

    const user = userEvent.setup();
    renderOpenButton(<div role="status">상세 로딩 중</div>);

    await user.click(screen.getByRole('button', { name: '상세보기' }));

    expect(await screen.findByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('상세 로딩 중');
    expect(requestedId).toBe(CHANNEL.id);

    responseGate.resolve(undefined);

    expect(await screen.findByText('메타 광고 상세 설명')).toBeVisible();
    expect(screen.queryByText('상세 로딩 중')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: CHANNEL.name })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '닫기' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: CHANNEL.name })).not.toBeInTheDocument();
    });
  });

  it('상세 요청 오류를 모달 안에 표시하고 다시 시도한다', async () => {
    let requestCount = 0;

    server.use(
      http.get(/\/api\/v1\/channels\/[^/]+$/, () => {
        requestCount += 1;
        return requestCount === 1
          ? HttpResponse.json({ success: false }, { status: 500 })
          : HttpResponse.json({ success: true, data: createDetailResponse() });
      }),
    );

    const user = userEvent.setup();
    renderOpenButton();

    await user.click(screen.getByRole('button', { name: '상세보기' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('채널 정보를 불러오지 못했어요');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('메타 광고 상세 설명')).toBeVisible();
    expect(requestCount).toBe(2);
  });

  it('상품과 집행 사례가 비어 있어도 각 탭의 빈 상태를 표시한다', async () => {
    server.use(
      http.get(/\/api\/v1\/channels\/[^/]+$/, () =>
        HttpResponse.json({
          success: true,
          data: createDetailResponse({ products: [], references: [] }),
        }),
      ),
    );

    const user = userEvent.setup();
    renderOpenButton();

    await user.click(screen.getByRole('button', { name: '상세보기' }));
    expect(await screen.findByText('메타 광고 상세 설명')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '광고 상품' }));
    await waitFor(() => {
      expect(screen.getByText('등록된 광고 상품이 없습니다.')).toBeVisible();
    });

    await user.click(screen.getByRole('tab', { name: '광고 예시' }));
    await waitFor(() => {
      expect(screen.getByText('등록된 광고 예시가 없습니다.')).toBeVisible();
    });
  });
});
