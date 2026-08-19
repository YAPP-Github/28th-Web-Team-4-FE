import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import type {
  ChannelComparisonItemResponse,
  ChannelListItemResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';

import { ComparePage } from './compare-page';
import { CompareResultPage } from './compare-result-page';

const { pushMock, replaceMock, showWarningToastMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
  replaceMock: vi.fn<(href: string) => void>(),
  showWarningToastMock: vi.fn<(description: string, options?: { id?: string }) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
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

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}));

function createChannel(
  id: string,
  name: string,
  primaryCategory: ChannelListItemResponse['primaryCategory'] = 'OTHERS',
): ChannelListItemResponse {
  return {
    id,
    name,
    logoUrl: null,
    description: `${name} 채널 설명`,
    primaryCategory,
  };
}

const DEFAULT_CHANNELS = [
  createChannel('channel-naver', '네이버 검색 광고', 'EDUCATION'),
  createChannel('channel-kakao', '카카오 키워드 광고', 'SHOPPING_COMMERCE'),
  createChannel('channel-meta', '메타 피드 광고', 'LIFESTYLE'),
  createChannel('channel-youtube', '유튜브 영상 광고', 'ENTERTAINMENT'),
  createChannel('channel-5', '네이버 쇼핑 광고', 'SHOPPING_COMMERCE'),
  createChannel('channel-6', '카카오 비즈보드', 'BUSINESS_B2B'),
  createChannel('channel-7', '인스타그램 릴스 광고', 'MUSIC_MEDIA'),
  createChannel('channel-8', '유튜브 쇼츠 광고', 'ENTERTAINMENT'),
  createChannel('channel-9', '네이버 디스플레이 광고', 'NEWS_INFORMATION'),
  createChannel('channel-10', '카카오 채널 메시지'),
  createChannel('channel-11', '메타 스토리 광고', 'LIFESTYLE'),
  createChannel('channel-12', '유튜브 인스트림 광고', 'EDUCATION'),
];

const TOTAL_PAGE_COUNT = 5;

const COMPARISON_CHANNEL_NAMES: Record<string, string> = {
  'channel-naver': '네이버 검색 광고',
  'channel-kakao': '카카오 키워드 광고',
  'channel-meta': '메타 피드 광고',
};

function createComparisonItem(
  channelId: string,
  overrides: Partial<ChannelComparisonItemResponse> = {},
): ChannelComparisonItemResponse {
  return {
    channelId,
    channelName: COMPARISON_CHANNEL_NAMES[channelId] ?? `${channelId} 채널`,
    previewImageUrl: null,
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
  return HttpResponse.json({ success: true, data: { items }, error: null, code: null });
}

function recommendationsResponse(channelIds: readonly string[]) {
  return HttpResponse.json({
    success: true,
    data: channelIds.map((channelId) => ({
      channelId,
      channelName: COMPARISON_CHANNEL_NAMES[channelId] ?? `${channelId} 채널`,
    })),
    error: null,
    code: null,
  });
}

function createPageChannels(page: number): ChannelListItemResponse[] {
  if (page < 0 || page >= TOTAL_PAGE_COUNT) {
    return [];
  }

  if (page === 0) {
    return DEFAULT_CHANNELS;
  }

  return DEFAULT_CHANNELS.map((channel) => ({
    ...channel,
    id: `${channel.id}-page-${page + 1}`,
    name: `${channel.name} ${page + 1}`,
  }));
}

const ALL_CHANNELS = Array.from({ length: TOTAL_PAGE_COUNT }, (_, page) =>
  createPageChannels(page),
).flat();

function createChannelPage(
  content: ChannelListItemResponse[],
  options: {
    number?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
  } = {},
): PageResponseChannelListItemResponse {
  const number = options.number ?? 0;
  const totalPages = options.totalPages ?? 1;

  return {
    content,
    number,
    size: options.size ?? 12,
    totalElements: options.totalElements ?? content.length,
    totalPages,
    first: options.first ?? number === 0,
    last: options.last ?? number >= totalPages - 1,
  };
}

function channelPageResponse(page: PageResponseChannelListItemResponse) {
  return HttpResponse.json({ success: true, data: page, error: null, code: null });
}

function defaultChannelResponse(url: URL) {
  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? 12);
  const name = url.searchParams.get('name')?.trim() ?? '';
  const primaryCategories = url.searchParams.getAll('primaryCategory');
  const filteredChannels = ALL_CHANNELS.filter(
    (channel) =>
      (name.length === 0 || channel.name.includes(name)) &&
      (primaryCategories.length === 0 || primaryCategories.includes(channel.primaryCategory)),
  );
  const pageStart = page * size;
  const totalPages = Math.ceil(filteredChannels.length / size);

  return channelPageResponse(
    createChannelPage(filteredChannels.slice(pageStart, pageStart + size), {
      number: page,
      size,
      totalElements: filteredChannels.length,
      totalPages,
    }),
  );
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function renderCompareRoute(
  page: ReactNode,
  searchParams = '',
  onUrlUpdate: OnUrlUpdateFunction = () => {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const NuqsTestingAdapter = withNuqsTestingAdapter({ searchParams, hasMemory: true, onUrlUpdate });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NuqsTestingAdapter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NuqsTestingAdapter>
    );
  }

  return render(page, { wrapper: Wrapper });
}

function renderComparePage(searchParams = '') {
  return renderCompareRoute(<ComparePage />, searchParams);
}

function renderCompareResultPage(
  searchParams = '?channels=channel-naver,channel-kakao,channel-meta',
  onUrlUpdate: OnUrlUpdateFunction = () => {},
) {
  return renderCompareRoute(<CompareResultPage />, searchParams, onUrlUpdate);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getChannelCheckbox(name: string) {
  return screen.getByRole('checkbox', { name: new RegExp(`${escapeRegExp(name)} 선택`) });
}

function getCompareButton() {
  return screen.getByRole('button', { name: /선택한 채널 비교하기/ });
}

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();
    replaceMock.mockReset();
    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) =>
        defaultChannelResponse(new URL(request.url)),
      ),
      http.get(/\/api\/v1\/channel-comparisons$/, ({ request }) => {
        const channelIds = new URL(request.url).searchParams.getAll('channelIds');

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
      http.get(/\/api\/v1\/recommendations$/, () => recommendationsResponse([])),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('스크롤 내부 콘텐츠에 상단 32px과 하단 38px 안전 여백을 둔다', async () => {
    renderComparePage();

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    const channelGrid = screen.getByRole('list');
    const safeArea = channelGrid.parentElement;
    const scrollContainer = safeArea?.parentElement;

    expect(safeArea).toHaveClass('self-start', 'pt-[32px]', 'pb-[38px]');
    expect(scrollContainer).toHaveClass('overflow-y-auto');
    expect(scrollContainer).not.toHaveClass('py-[46px]');
    expect(scrollContainer).not.toHaveClass('pt-[32px]');
    expect(scrollContainer).not.toHaveClass('pb-[38px]');
  });

  it('첫 요청 동안 12개 스켈레톤을 보여주고 API 첫 페이지를 조회한다', async () => {
    const responseGate = createDeferred<void>();
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, async ({ request }) => {
        requestedUrl = new URL(request.url);
        await responseGate.promise;
        return defaultChannelResponse(requestedUrl);
      }),
    );

    renderComparePage();

    expect(screen.getByRole('heading', { name: '비교할 채널을 선택해 주세요' })).toBeVisible();
    expect(screen.getByText('최대 3개까지 선택할 수 있어요')).toBeVisible();
    expect(screen.getByRole('combobox', { name: '채널 카테고리' })).toHaveTextContent('전체');
    expect(screen.getByLabelText('채널 검색')).toHaveAttribute('placeholder', '검색');
    expect(screen.getAllByTestId('channel-card-skeleton')).toHaveLength(12);

    responseGate.resolve(undefined);

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(screen.getAllByRole('checkbox')).toHaveLength(12);
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(getCompareButton()).toBeDisabled();
    expect(requestedUrl?.searchParams.get('page')).toBe('0');
    expect(requestedUrl?.searchParams.get('size')).toBe('12');
    expect(requestedUrl?.searchParams.has('sort')).toBe(false);
  });

  it('검색 요청을 debounce하고 응답 전에는 이전 결과를 유지한다', async () => {
    const searchResponseGate = createDeferred<void>();
    const searchRequests: string[] = [];
    const searchedChannel = createChannel('channel-meta-search', '메타 신규 광고', 'LIFESTYLE');

    server.use(
      http.get(/\/api\/v1\/channels$/, async ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');

        if (!name) {
          return defaultChannelResponse(url);
        }

        searchRequests.push(name);
        await searchResponseGate.promise;
        return channelPageResponse(createChannelPage([searchedChannel]));
      }),
    );

    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    vi.useFakeTimers();
    fireEvent.change(screen.getByLabelText('채널 검색'), { target: { value: '메타 광고' } });

    expect(screen.getByText('네이버 검색 광고')).toBeVisible();
    expect(searchRequests).toHaveLength(0);

    await act(() => vi.advanceTimersByTimeAsync(299));
    expect(searchRequests).toHaveLength(0);

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(searchRequests).toEqual(['메타 광고']);
    expect(screen.getByText('네이버 검색 광고')).toBeVisible();

    vi.useRealTimers();
    searchResponseGate.resolve(undefined);

    expect(await screen.findByText('메타 신규 광고')).toBeVisible();
    expect(screen.queryByText('네이버 검색 광고')).not.toBeInTheDocument();
  });

  it('늦게 끝난 이전 검색 응답이 최신 검색 결과를 덮어쓰지 않는다', async () => {
    const slowResponseGate = createDeferred<void>();
    const searchRequests: string[] = [];
    const slowChannel = createChannel('channel-slow-search', '느린 검색 결과');
    const fastChannel = createChannel('channel-fast-search', '빠른 검색 결과');
    let slowResponseCompleted = false;

    server.use(
      http.get(/\/api\/v1\/channels$/, async ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');

        if (!name) {
          return defaultChannelResponse(url);
        }

        searchRequests.push(name);

        if (name === '느린 검색') {
          await slowResponseGate.promise;
          slowResponseCompleted = true;
          return channelPageResponse(createChannelPage([slowChannel]));
        }

        return channelPageResponse(createChannelPage([fastChannel]));
      }),
    );

    renderComparePage('?q=느린%20검색');
    await waitFor(() => expect(searchRequests).toEqual(['느린 검색']));

    fireEvent.change(screen.getByLabelText('채널 검색'), { target: { value: '빠른 검색' } });
    await waitFor(() => expect(searchRequests).toEqual(['느린 검색', '빠른 검색']));
    expect(await screen.findByText('빠른 검색 결과')).toBeVisible();

    slowResponseGate.resolve(undefined);
    await waitFor(() => expect(slowResponseCompleted).toBe(true));

    expect(screen.getByText('빠른 검색 결과')).toBeVisible();
    expect(screen.queryByText('느린 검색 결과')).not.toBeInTheDocument();
  });

  it('검색 결과가 없으면 빈 상태를 보여준다', async () => {
    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        return name
          ? channelPageResponse(createChannelPage([], { totalPages: 0 }))
          : defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    await user.type(screen.getByLabelText('채널 검색'), '없는 채널');

    expect(await screen.findByText('검색 결과가 없어요')).toBeVisible();
    expect(screen.getByText('다른 검색어로 다시 찾아보세요')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(screen.getByLabelText('채널 검색')).toHaveValue('');
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
  });

  it('검색어와 여러 카테고리를 하나의 서버 요청으로 조합한다', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return defaultChannelResponse(requestedUrl);
      }),
    );

    renderComparePage('?q=네이버&category=EDUCATION,SHOPPING_COMMERCE');

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(screen.getByText('네이버 쇼핑 광고')).toBeVisible();
    expect(screen.queryByText('카카오 키워드 광고')).not.toBeInTheDocument();
    expect(requestedUrl?.searchParams.get('name')).toBe('네이버');
    expect(requestedUrl?.searchParams.getAll('primaryCategory')).toEqual([
      'EDUCATION',
      'SHOPPING_COMMERCE',
    ]);
    expect(requestedUrl?.searchParams.get('page')).toBe('0');
    expect(requestedUrl?.searchParams.get('size')).toBe('12');
  });

  it('여러 카테고리를 정확히 필터링하고 첫 페이지로 돌아간다', async () => {
    const filteredRequests: URL[] = [];

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);

        if (url.searchParams.has('primaryCategory')) {
          filteredRequests.push(url);
        }

        return defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage('?page=3');

    expect(await screen.findByText('네이버 검색 광고 3')).toBeVisible();
    expect(screen.getByRole('button', { name: '페이지 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    const categoryDropdown = screen.getByRole('combobox', { name: '채널 카테고리' });
    await user.click(categoryDropdown);
    await user.click(await screen.findByRole('option', { name: /교육/ }));
    await user.click(await screen.findByRole('option', { name: /쇼핑·커머스/ }));

    await waitFor(() => {
      expect(categoryDropdown).toHaveTextContent('교육 외 1개');
      expect(filteredRequests.at(-1)?.searchParams.getAll('primaryCategory')).toEqual([
        'EDUCATION',
        'SHOPPING_COMMERCE',
      ]);
    });
    expect(screen.getByRole('checkbox', { name: '교육 선택' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '쇼핑·커머스 선택' })).toBeChecked();
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('네이버 검색 광고')).toBeVisible();
    expect(screen.getByText('카카오 키워드 광고')).toBeVisible();
    expect(filteredRequests.at(-1)?.searchParams.get('page')).toBe('0');
    expect(filteredRequests.at(-1)?.searchParams.get('size')).toBe('12');
  });

  it('필터된 다음 페이지에서도 같은 카테고리를 서버에 전달한다', async () => {
    const filteredRequests: URL[] = [];

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);
        filteredRequests.push(url);
        return defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage('?category=EDUCATION,SHOPPING_COMMERCE');

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '페이지 2' }));

    expect(await screen.findByText('네이버 검색 광고 4')).toBeVisible();
    expect(filteredRequests.at(-1)?.searchParams.getAll('primaryCategory')).toEqual([
      'EDUCATION',
      'SHOPPING_COMMERCE',
    ]);
    expect(filteredRequests.at(-1)?.searchParams.get('page')).toBe('1');
    expect(filteredRequests.at(-1)?.searchParams.get('size')).toBe('12');
  });

  it('기타 선택 시 API의 OTHERS 카테고리를 그대로 필터링한다', async () => {
    let filteredRequest: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);

        if (url.searchParams.has('primaryCategory')) {
          filteredRequest = url;
        }

        return defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    const categoryDropdown = screen.getByRole('combobox', { name: '채널 카테고리' });
    await user.click(categoryDropdown);
    await user.click(await screen.findByRole('option', { name: /기타/ }));

    expect(categoryDropdown).toHaveTextContent('기타');
    expect(await screen.findByText('카카오 채널 메시지')).toBeVisible();
    expect(screen.queryByText('네이버 검색 광고')).not.toBeInTheDocument();
    expect(filteredRequest?.searchParams.getAll('primaryCategory')).toEqual(['OTHERS']);
    expect(filteredRequest?.searchParams.get('page')).toBe('0');
  });

  it('잘못된 deep link 카테고리는 UI와 API 요청에서 제외한다', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        requestedUrl = new URL(request.url);
        return defaultChannelResponse(requestedUrl);
      }),
    );

    renderComparePage('?category=INVALID_CATEGORY,EDUCATION');

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(screen.getByRole('combobox', { name: '채널 카테고리' })).toHaveTextContent('교육');
    expect(requestedUrl?.searchParams.getAll('primaryCategory')).toEqual(['EDUCATION']);
  });

  it('범위를 벗어난 deep link 페이지는 빈 상태를 보여준다', async () => {
    renderComparePage('?page=99');

    expect(await screen.findByText('검색 결과가 없어요')).toBeVisible();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(screen.getByRole('button', { name: '페이지 5' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('페이지 결과를 교체하고 페이지 사이에서 선택을 유지한다', async () => {
    const secondPageGate = createDeferred<void>();
    const requestedPages: number[] = [];

    server.use(
      http.get(/\/api\/v1\/channels$/, async ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? 0);
        requestedPages.push(page);

        if (page === 1) {
          await secondPageGate.promise;
        }

        return defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(screen.getByRole('button', { name: '페이지 2' }));

    expect(screen.getByText('네이버 검색 광고')).toBeVisible();
    expect(getChannelCheckbox('네이버 검색 광고')).toBeChecked();

    secondPageGate.resolve(undefined);

    expect(await screen.findByText('네이버 검색 광고 2')).toBeVisible();
    expect(screen.queryByText('네이버 검색 광고')).not.toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(12);
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (1/3)');

    await user.click(screen.getByRole('button', { name: '페이지 1' }));

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(getChannelCheckbox('네이버 검색 광고')).toBeChecked();
    expect(requestedPages).toContain(0);
    expect(requestedPages).toContain(1);
  });

  it('첫 페이지 요청 오류를 표시하고 재시도한다', async () => {
    let requestCount = 0;

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json(
            {
              success: false,
              data: null,
              error: { code: 'CH-500', message: '채널 조회 실패', fieldErrors: [] },
              code: null,
            },
            { status: 500 },
          );
        }

        return defaultChannelResponse(new URL(request.url));
      }),
    );

    const user = userEvent.setup();
    renderComparePage();

    expect(await screen.findByText('채널을 불러오지 못했어요')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(requestCount).toBe(2);
  });

  it('필터 요청 오류를 같은 조건으로 재시도한다', async () => {
    const attemptedRequests: URL[] = [];

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);
        attemptedRequests.push(url);

        if (attemptedRequests.length === 1) {
          return HttpResponse.json(
            {
              success: false,
              data: null,
              error: { code: 'CH-500', message: '채널 조회 실패', fieldErrors: [] },
              code: null,
            },
            { status: 500 },
          );
        }

        return defaultChannelResponse(url);
      }),
    );

    const user = userEvent.setup();
    renderComparePage('?category=EDUCATION');

    expect(await screen.findByText('채널을 불러오지 못했어요')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();
    expect(attemptedRequests).toHaveLength(2);

    for (const request of attemptedRequests) {
      expect(request.searchParams.getAll('primaryCategory')).toEqual(['EDUCATION']);
      expect(request.searchParams.get('page')).toBe('0');
      expect(request.searchParams.get('size')).toBe('12');
    }
  });

  it('카드 선택을 토글하고 CTA 개수를 갱신한다', async () => {
    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    const naverCheckbox = getChannelCheckbox('네이버 검색 광고');
    const naverCard = screen.getByText('네이버 검색 광고').closest('label');

    await user.click(naverCheckbox);

    expect(naverCheckbox).toBeChecked();
    expect(naverCard).toHaveClass('outline-outline-selected');
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (1/3)');

    await user.click(naverCheckbox);

    expect(naverCheckbox).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });

  it('선택 한도를 3개로 유지하고 경고 토스트를 보여준다', async () => {
    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(getChannelCheckbox('카카오 키워드 광고'));
    await user.click(getChannelCheckbox('메타 피드 광고'));
    await user.click(getChannelCheckbox('유튜브 영상 광고'));

    expect(getChannelCheckbox('네이버 검색 광고')).toBeChecked();
    expect(getChannelCheckbox('카카오 키워드 광고')).toBeChecked();
    expect(getChannelCheckbox('메타 피드 광고')).toBeChecked();
    expect(getChannelCheckbox('유튜브 영상 광고')).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (3/3)');
    expect(showWarningToastMock).toHaveBeenCalledWith('채널 비교는 최대 3개까지만 선택 가능해요.', {
      id: 'compare-selection-limit',
    });
  });

  it('3개 선택 시 CTA를 활성화하고 비교 결과 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(getChannelCheckbox('카카오 키워드 광고'));

    expect(getCompareButton()).toBeDisabled();

    await user.click(getChannelCheckbox('메타 피드 광고'));
    expect(getCompareButton()).toBeEnabled();

    await user.click(getCompareButton());

    expect(pushMock).toHaveBeenCalledWith(
      '/compare/result?channels=channel-naver,channel-kakao,channel-meta',
    );
  });

  it('비교에 필요한 채널 수보다 적은 channels query는 선택 화면을 유지한다', async () => {
    renderComparePage('?channels=channel-meta');
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    expect(getChannelCheckbox('메타 피드 광고')).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });

  it('API 응답 순서와 필드를 모든 비교 결과 섹션에 표시한다', async () => {
    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, () =>
        comparisonResponse([
          createComparisonItem('channel-meta', {
            channelName: '응답 B',
            audienceSummary: 'B 오디언스',
            adFormats: ['피드', '영상'],
            targetingMethods: ['지역', '관심사'],
            minBudgetWon: 123_456,
            advantages: ['B 장점'],
            tags: ['B 태그'],
            cpcWon: 111,
            cpmWon: 1_111,
            estImpressions: { min: 11_000, max: 22_000 },
            estClicks: { min: 110, max: 220 },
          }),
          createComparisonItem('channel-naver', { channelName: '응답 A', matchRate: null }),
          createComparisonItem('channel-kakao', { channelName: '응답 C' }),
        ]),
      ),
    );

    renderCompareResultPage();

    const firstChannelHeading = await screen.findByRole('heading', {
      level: 2,
      name: '응답 B',
    });
    const channelCardList = firstChannelHeading.closest('ul');

    if (!channelCardList) {
      throw new Error('채널 비교 카드 목록을 찾지 못했습니다.');
    }

    expect(
      within(channelCardList)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['응답 B', '응답 A', '응답 C']);
    expect(
      within(screen.getByRole('region', { name: '채널별 예상 노출 · 클릭 수' })).getByText(
        '응답 B',
      ),
    ).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: '채널별 상세 정보' })).getByText('123,456원'),
    ).toBeVisible();
    expect(screen.getByText('B 오디언스')).toBeVisible();
    expect(screen.getByText('피드 · 영상')).toBeVisible();
    expect(screen.getByText('지역 · 관심사')).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: '채널별 CPC와 CPM' })).getAllByText('응답 B'),
    ).toHaveLength(2);
    const insightsRegion = screen.getByRole('region', { name: '채널별 인사이트' });

    expect(within(insightsRegion).getByText(/B 태그/)).toBeVisible();
    expect(insightsRegion.parentElement).toHaveClass('pt-040', 'pb-072', 'self-start');
    expect(screen.getByText('B 장점')).toBeVisible();
    expect(screen.queryByText('채널 추가하기')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });

  it('3개 결과에서 채널을 제거하면 URL을 보존하며 2개 결과로 교체한다', async () => {
    const user = userEvent.setup();
    const nextResponseGate = createDeferred<void>();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const requestedChannelIds: string[][] = [];

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, async ({ request }) => {
        const url = new URL(request.url);
        const channelIds = url.searchParams.getAll('channelIds');
        requestedChannelIds.push(channelIds);

        if (channelIds.length === 2) {
          await nextResponseGate.promise;
        }

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    renderCompareResultPage(
      '?channels=channel-naver,channel-kakao,channel-meta&onboardingId=onboarding-87',
      onUrlUpdate,
    );

    expect(await screen.findByRole('heading', { level: 2, name: '메타 피드 광고' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '메타 피드 광고 비교에서 제거' }));

    await waitFor(() => {
      const event = onUrlUpdate.mock.lastCall?.[0];
      expect(event?.searchParams.get('channels')).toBe('channel-naver,channel-kakao');
      expect(event?.searchParams.get('onboardingId')).toBe('onboarding-87');
      expect(event?.options.history).toBe('replace');
    });
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(
      '변경된 채널의 비교 결과를 불러오는 중이에요',
    );
    expect(screen.getByRole('heading', { level: 2, name: '메타 피드 광고' })).toBeVisible();
    for (const button of screen.getAllByRole('button', { name: /비교에서 제거/ })) {
      expect(button).toBeDisabled();
    }

    nextResponseGate.resolve();

    expect(await screen.findByText('채널 추가하기')).toBeVisible();
    expect(
      screen.queryByRole('heading', { level: 2, name: '메타 피드 광고' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /비교에서 제거/ })).not.toBeInTheDocument();
    expect(requestedChannelIds).toEqual([
      ['channel-naver', 'channel-kakao', 'channel-meta'],
      ['channel-naver', 'channel-kakao'],
    ]);
  });

  it('2개 결과에서 채널을 검색·추가하면 URL과 비교 결과를 3개로 교체한다', async () => {
    const user = userEvent.setup();
    const nextResponseGate = createDeferred<void>();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const requestedChannelIds: string[][] = [];

    server.use(
      http.get(/\/api\/v1\/recommendations$/, () => recommendationsResponse(['channel-meta'])),
      http.get(/\/api\/v1\/channel-comparisons$/, async ({ request }) => {
        const channelIds = new URL(request.url).searchParams.getAll('channelIds');
        requestedChannelIds.push(channelIds);

        if (channelIds.length === 3) {
          await nextResponseGate.promise;
        }

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    renderCompareResultPage(
      '?channels=channel-naver,channel-kakao&onboardingId=onboarding-87',
      onUrlUpdate,
    );

    await user.click(await screen.findByLabelText('비교할 채널 추가'));
    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });

    await user.type(searchInput, '네이버 검색 광고');
    const [selectedOption] = await screen.findAllByRole('option', {
      name: /네이버 검색 광고/,
    });

    expect(selectedOption).toHaveAttribute('aria-disabled', 'true');

    const activeSearchInput = screen.getByRole('combobox', { name: '추가할 채널 검색' });
    await user.clear(activeSearchInput);
    await user.type(activeSearchInput, '메타');

    const [metaOption] = await screen.findAllByRole('option', { name: /메타 피드 광고/ });

    if (!metaOption) {
      throw new Error('메타 피드 광고 검색 옵션을 찾지 못했습니다.');
    }

    expect(within(metaOption).getByText('추천')).toBeVisible();
    await user.click(metaOption);

    await waitFor(() => {
      const event = onUrlUpdate.mock.lastCall?.[0];
      expect(event?.searchParams.get('channels')).toBe('channel-naver,channel-kakao,channel-meta');
      expect(event?.searchParams.get('onboardingId')).toBe('onboarding-87');
      expect(event?.options.history).toBe('replace');
    });
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(
      '변경된 채널의 비교 결과를 불러오는 중이에요',
    );
    expect(screen.getByRole('heading', { level: 2, name: '네이버 검색 광고' })).toBeVisible();
    expect(screen.queryByLabelText('비교할 채널 추가')).not.toBeInTheDocument();

    nextResponseGate.resolve();

    expect(await screen.findByRole('heading', { level: 2, name: '메타 피드 광고' })).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: '채널별 예상 노출 · 클릭 수' })).getByText(
        '메타 피드 광고',
      ),
    ).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: '채널별 상세 정보' })).getByText('메타 피드 광고'),
    ).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: '채널별 CPC와 CPM' })).getAllByText(
        '메타 피드 광고',
      ),
    ).toHaveLength(2);
    expect(
      within(screen.getByRole('region', { name: '채널별 인사이트' })).getByText(/메타 피드 광고/),
    ).toBeVisible();
    expect(screen.getAllByRole('button', { name: /비교에서 제거/ })).toHaveLength(3);
    expect(requestedChannelIds).toEqual([
      ['channel-naver', 'channel-kakao'],
      ['channel-naver', 'channel-kakao', 'channel-meta'],
    ]);
  });

  it('요청 채널은 2개지만 응답 결과가 2개가 아니면 추가 picker를 표시하지 않는다', async () => {
    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, () =>
        comparisonResponse([createComparisonItem('channel-naver')]),
      ),
    );

    renderCompareResultPage('?channels=channel-naver,channel-kakao');

    expect(
      await screen.findByRole('heading', { level: 2, name: '네이버 검색 광고' }),
    ).toBeVisible();
    expect(screen.queryByLabelText('비교할 채널 추가')).not.toBeInTheDocument();
  });

  it('채널 추가 후 비교 재조회가 실패하면 기존 비교 오류 화면을 표시한다', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, ({ request }) => {
        const channelIds = new URL(request.url).searchParams.getAll('channelIds');

        if (channelIds.length === 3) {
          return HttpResponse.json({ success: false }, { status: 500 });
        }

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    renderCompareResultPage('?channels=channel-naver,channel-kakao');

    await user.click(await screen.findByLabelText('비교할 채널 추가'));
    await user.type(
      await screen.findByRole('combobox', { name: '추가할 채널 검색' }),
      '메타 피드 광고',
    );
    const [metaOption] = await screen.findAllByRole('option', { name: /메타 피드 광고/ });

    if (!metaOption) {
      throw new Error('메타 피드 광고 검색 옵션을 찾지 못했습니다.');
    }

    await user.click(metaOption);

    expect(await screen.findByRole('alert')).toHaveTextContent('비교 결과를 불러오지 못했어요');
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 다시 선택' })).toBeVisible();
  });

  it('최초 비교 결과를 조회하는 동안 전체 로딩 화면을 보여준다', async () => {
    const responseGate = createDeferred<void>();

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, async ({ request }) => {
        await responseGate.promise;
        const channelIds = new URL(request.url).searchParams.getAll('channelIds');

        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    renderCompareResultPage();

    expect(screen.getByRole('status')).toHaveTextContent('비교 결과를 불러오고 있어요');
    expect(screen.getByText('선택한 채널의 정보를 비교하고 있습니다')).toBeVisible();
    expect(
      screen.queryByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).not.toBeInTheDocument();

    responseGate.resolve();

    expect(
      await screen.findByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
  });

  it.each([400, 404, 500])(
    '최초 조회가 %s 오류로 실패하면 전체 오류 화면을 보여준다',
    async (status) => {
      server.use(
        http.get(/\/api\/v1\/channel-comparisons$/, () =>
          HttpResponse.json({ success: false }, { status }),
        ),
      );

      renderCompareResultPage();

      expect(await screen.findByRole('alert')).toHaveTextContent('비교 결과를 불러오지 못했어요');
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeVisible();
      expect(screen.getByRole('button', { name: '채널 다시 선택' })).toBeVisible();
    },
  );

  it('최초 조회가 네트워크 오류로 실패하면 전체 오류 화면을 보여준다', async () => {
    server.use(http.get(/\/api\/v1\/channel-comparisons$/, () => HttpResponse.error()));

    renderCompareResultPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('비교 결과를 불러오지 못했어요');
  });

  it('최초 조회 실패 후 다시 시도하면 비교 결과를 보여준다', async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, ({ request }) => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json({ success: false }, { status: 500 });
        }

        const channelIds = new URL(request.url).searchParams.getAll('channelIds');
        return comparisonResponse(channelIds.map((channelId) => createComparisonItem(channelId)));
      }),
    );

    renderCompareResultPage();

    await user.click(await screen.findByRole('button', { name: '다시 시도' }));

    expect(
      await screen.findByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
    expect(requestCount).toBe(2);
  });

  it('최초 조회 실패 후 채널을 다시 선택하면 비교 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(/\/api\/v1\/channel-comparisons$/, () =>
        HttpResponse.json({ success: false }, { status: 500 }),
      ),
    );

    renderCompareResultPage();

    await user.click(await screen.findByRole('button', { name: '채널 다시 선택' }));

    expect(pushMock).toHaveBeenCalledWith('/compare');
  });
});
