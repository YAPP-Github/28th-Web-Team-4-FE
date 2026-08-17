import { Suspense, type ReactNode } from 'react';
import { OverlayProvider } from 'overlay-kit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import type { ChannelDetailResponse, RecommendationItemResponse } from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';
import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';

import { RecommendResultPage, RecommendResultWithRecommendations } from './recommend-result-page';

const { onCompareMock, pushMock, showWarningToastMock } = vi.hoisted(() => ({
  onCompareMock: vi.fn<(channelIds: readonly string[]) => void>(),
  pushMock: vi.fn<(href: string) => void>(),
  showWarningToastMock: vi.fn<(description: string, options?: { id?: string }) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}));

vi.mock('@/shared/ui/toast', () => ({
  showWarningToast: showWarningToastMock,
}));

const initialStore = useRecommendOnboardingStore.getState();
const RECOMMENDATION_ONBOARDING_ID = 'onboarding-87';
const apiRecommendation = {
  channelId: 'channel-naver',
  channelName: '네이버 검색 광고',
  matchRate: 88,
  recommendationReason: '설정한 목적과 예산에서 유저에게 도달 효율이 가장 높아요',
  primaryTarget: '20~40대',
  cpcWon: 320,
  pricingModel: 'CPC',
  minBudgetWon: 300000,
  estImpressions: { min: 12000, max: 15000 },
  estClicks: { min: 300, max: 450 },
  isExecutable: true,
} as const satisfies RecommendationItemResponse;

const recommendationChannel = {
  id: apiRecommendation.channelId,
  name: apiRecommendation.channelName,
  description: apiRecommendation.recommendationReason,
  cpcPrice: '클릭 1회당 320원~',
  matchRate: apiRecommendation.matchRate,
  thumbnailSrc: '/recommend-assets/naver-search-ad.png',
  metrics: [
    { label: '예상 노출', value: '12,000~15,000회' },
    { label: '예상 클릭', value: '300~450회' },
    { label: '최소 예산', value: '30만' },
    { label: '주요 타깃', value: apiRecommendation.primaryTarget },
    { label: '과금 방식', value: '클릭당(CPC)' },
  ],
} as const satisfies RecommendedChannel;

const apiRecommendations = [
  apiRecommendation,
  {
    ...apiRecommendation,
    channelId: 'channel-youtube',
    channelName: '유튜브 검색 광고',
    matchRate: 84,
  },
  {
    ...apiRecommendation,
    channelId: 'channel-kakao',
    channelName: '카카오 검색 광고',
    matchRate: 81,
  },
] satisfies RecommendationItemResponse[];

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithProviders(children: ReactNode) {
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>{children}</OverlayProvider>
    </QueryClientProvider>,
  );
}

function renderRecommendResultPage(props?: { isGuest?: boolean }) {
  return renderWithProviders(
    <RecommendResultPage headerAction={null} onCompare={onCompareMock} {...props} />,
  );
}

function getSelectionCheckbox(name: string) {
  return screen.getByRole('checkbox', { name: `${name} 비교 목록 선택` });
}

function mockRecommendations(
  recommendations: readonly RecommendationItemResponse[] = [apiRecommendation],
) {
  server.use(
    http.get(/\/api\/v1\/recommendations$/, () => {
      return HttpResponse.json({
        success: true,
        data: recommendations,
      });
    }),
  );
}

function createChannelDetailResponse(
  overrides: Partial<NonNullable<ChannelDetailResponse>> = {},
): NonNullable<ChannelDetailResponse> {
  return {
    id: 'channel-naver',
    name: '네이버 검색 광고',
    tagline: '검색 의도가 높은 고객에게 도달하기 좋아요',
    logoUrl: null,
    description: '검색 광고로 구매 의도가 높은 고객을 만날 수 있어요',
    primaryCategory: 'SHOPPING_COMMERCE',
    mediaType: 'SEARCH',
    suitableCategories: ['SHOPPING_COMMERCE'],
    ageBandCodes: ['AGE_20S'],
    primaryAgeBand: '20대',
    primaryGender: 'ALL',
    audienceSummary: null,
    audienceTraits: null,
    advantages: [],
    minBudgetWon: null,
    maxBudgetWon: null,
    executionType: 'SELF',
    adFormats: [],
    targetingMethods: [],
    products: [],
    audienceMetrics: [],
    references: [],
    recommendationBasis: null,
    ...overrides,
  };
}

function mockChannelDetail(onRequest?: (url: URL) => void) {
  server.use(
    http.get(/\/api\/v1\/channels\/[^/]+$/, ({ request }) => {
      onRequest?.(new URL(request.url));

      return HttpResponse.json({
        success: true,
        data: createChannelDetailResponse(),
      });
    }),
  );
}

function renderRecommendResultWithRecommendations(
  recommendations?: readonly RecommendationItemResponse[],
) {
  mockRecommendations(recommendations);

  return renderWithProviders(
    <Suspense fallback={<div>loading</div>}>
      <RecommendResultWithRecommendations
        isGuest={false}
        onboardingId={RECOMMENDATION_ONBOARDING_ID}
      />
    </Suspense>,
  );
}

describe('RecommendResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();
    useRecommendOnboardingStore.setState(initialStore, true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with a disabled 0/3 comparison CTA', () => {
    renderRecommendResultPage();

    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (0/3)' })).toBeDisabled();
  });

  it('toggles selection and enables the CTA after three channels are selected', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    const naverCheckbox = getSelectionCheckbox('네이버 검색 광고');
    await user.click(naverCheckbox);

    const naverCard = screen.getByRole('article', { name: '네이버 검색 광고' });
    expect(naverCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(naverCard).toHaveAttribute('data-selected', 'true');
    expect(within(naverCard).getByTestId('recommend-channel-selection-outline')).toBeVisible();
    expect(within(naverCard).getByTestId('recommend-channel-select-indicator')).toHaveClass(
      'bg-sys-primary-default',
    );
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (1/3)' })).toBeDisabled();

    await user.click(getSelectionCheckbox('유튜브 검색 광고'));

    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (2/3)' })).toBeDisabled();

    await user.click(getSelectionCheckbox('카카오 검색 광고'));
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' })).toBeEnabled();

    await user.click(naverCheckbox);
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (2/3)' })).toBeDisabled();
  });

  it('shows a toast instead of adding a fourth channel', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    for (const checkbox of screen
      .getAllByRole('checkbox', { name: /비교 목록 선택/ })
      .slice(0, 3)) {
      await user.click(checkbox);
    }

    await user.click(screen.getAllByRole('checkbox', { name: /비교 목록 선택/ })[3]);

    expect(showWarningToastMock).toHaveBeenCalledWith(
      '비교 목록은 최대 3개까지 선택할 수 있어요.',
      {
        id: 'recommend-comparison-limit',
      },
    );
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' })).toBeEnabled();
  });

  it('선택한 채널 ID를 비교 콜백에 전달한다', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    for (const checkbox of screen
      .getAllByRole('checkbox', { name: /비교 목록 선택/ })
      .slice(0, 3)) {
      await user.click(checkbox);
    }

    await user.click(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' }));

    expect(onCompareMock).toHaveBeenCalledWith(['naver-search-ad', 'youtube-ad', 'kakao-business']);
  });

  it('추천 결과의 onboarding ID를 포함해 비교 결과 페이지를 연다', async () => {
    const user = userEvent.setup();
    renderRecommendResultWithRecommendations(apiRecommendations);

    await user.click(
      await screen.findByRole('checkbox', { name: '네이버 검색 광고 비교 목록 선택' }),
    );
    await user.click(screen.getByRole('checkbox', { name: '유튜브 검색 광고 비교 목록 선택' }));
    await user.click(screen.getByRole('checkbox', { name: '카카오 검색 광고 비교 목록 선택' }));
    await user.click(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' }));

    expect(pushMock).toHaveBeenCalledWith(
      '/compare/result?channels=channel-naver,channel-youtube,channel-kakao&onboardingId=onboarding-87',
    );
  });

  it('opens channel details from the more button but not from card selection', async () => {
    const user = userEvent.setup();
    mockChannelDetail();
    renderRecommendResultPage();

    await user.click(getSelectionCheckbox('네이버 검색 광고'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '네이버 검색 광고 상세 정보 열기' }));
    expect(await screen.findByRole('dialog', { name: '네이버 검색 광고' })).toBeVisible();
  });

  it('includes onboardingId when opening details from a recommendation result', async () => {
    const user = userEvent.setup();
    let requestedUrl: URL | undefined;

    mockChannelDetail((url) => {
      requestedUrl = url;
    });

    renderWithProviders(
      <RecommendResultPage
        headerAction={null}
        channels={[recommendationChannel]}
        onboardingId={RECOMMENDATION_ONBOARDING_ID}
        onCompare={onCompareMock}
      />,
    );

    await user.click(screen.getByRole('button', { name: '네이버 검색 광고 상세 정보 열기' }));

    expect(await screen.findByRole('dialog', { name: '네이버 검색 광고' })).toBeVisible();
    expect(requestedUrl?.searchParams.get('onboardingId')).toBe(RECOMMENDATION_ONBOARDING_ID);
  });

  it('shows the CPC explanation tooltip on hover', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    const infoButton = screen.getByRole('button', { name: '추천 결과 안내' });
    await user.hover(infoButton);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('클릭 1회당 비용이란?');
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      '광고 클릭당 비용(CPC)을 말해요. 채소집에서는 쉬운 비교를 위해 단위를 모두 클릭 수 기준으로 통일했어요.',
    );
  });

  it('shows the cheapest CPC tooltip on the channel marked as lowest', () => {
    renderRecommendResultPage();

    const lowestCpcChannel = screen.getByRole('article', { name: '카카오 검색 광고' });
    const tooltipText = within(lowestCpcChannel).getByText('클릭당 비용이 가장 낮아요');

    expect(tooltipText).toBeVisible();
    expect(
      within(screen.getByRole('article', { name: '네이버 검색 광고' })).queryByText(
        '클릭당 비용이 가장 낮아요',
      ),
    ).not.toBeInTheDocument();
    expect(tooltipText.parentElement).toHaveClass('bg-surface-toast', 'text-text-lowest');
    expect(tooltipText.parentElement?.querySelector('[aria-hidden="true"]')).toHaveStyle({
      bottom: '-4px',
    });
  });

  it('blurs the top two cards and provides login links for guests', () => {
    renderRecommendResultPage({ isGuest: true });

    expect(screen.getAllByRole('link', { name: '로그인하기' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: '로그인하기' })[0]).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.getByRole('article', { name: '네이버 검색 광고' })).toHaveTextContent(
      '전체 결과를 볼 수 있어요',
    );
    expect(
      screen.getByRole('article', { name: '네이버 검색 광고' }).querySelector('.blur-\\[4px\\]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '카카오 검색 광고 상세 정보 열기' }),
    ).toBeInTheDocument();
  });

  it('saves recommendation results with the onboarding id and disables the button while pending', async () => {
    const user = userEvent.setup();
    const saveResponseGate = createDeferred<void>();
    let requestBody: unknown;

    server.use(
      http.post(/\/api\/v1\/recommendations$/, async ({ request }) => {
        requestBody = await request.json();
        await saveResponseGate.promise;

        return HttpResponse.json(
          {
            success: true,
            data: {
              onboardingId: RECOMMENDATION_ONBOARDING_ID,
              channelCount: 1,
              items: [apiRecommendation],
            },
          },
          { status: 201 },
        );
      }),
    );

    renderRecommendResultWithRecommendations();

    const saveButton = await screen.findByRole('button', { name: '결과 저장하기' });

    await user.click(saveButton);

    await waitFor(() => {
      expect(requestBody).toEqual({ onboardingId: RECOMMENDATION_ONBOARDING_ID });
    });
    expect(screen.getByRole('button', { name: '저장 중' })).toBeDisabled();

    saveResponseGate.resolve(undefined);

    expect(await screen.findByRole('button', { name: '저장 완료' })).toBeDisabled();
  });

  it('shows a warning toast when saving recommendation results fails', async () => {
    const user = userEvent.setup();

    server.use(
      http.post(/\/api\/v1\/recommendations$/, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 'ONB-007',
              message: '저장할 추천 결과를 찾을 수 없어요.',
            },
          },
          { status: 404 },
        );
      }),
    );

    renderRecommendResultWithRecommendations();

    await user.click(await screen.findByRole('button', { name: '결과 저장하기' }));

    await waitFor(() => {
      expect(showWarningToastMock).toHaveBeenCalledWith('저장할 추천 결과를 찾을 수 없어요.', {
        id: 'recommend-result-save-error',
      });
    });
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeEnabled();
  });
});
