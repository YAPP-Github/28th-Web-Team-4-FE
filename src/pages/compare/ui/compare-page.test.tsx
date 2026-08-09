import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';

import type {
  ChannelListItemResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';

import { ComparePage } from './compare-page';

const { showWarningToastMock } = vi.hoisted(() => ({
  showWarningToastMock: vi.fn<(description: string, options?: { id?: string }) => void>(),
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
  return HttpResponse.json({ success: true, data: page });
}

function defaultChannelResponse(url: URL) {
  const pageParam = url.searchParams.get('page');

  if (pageParam === null) {
    return channelPageResponse(
      createChannelPage(ALL_CHANNELS, {
        size: ALL_CHANNELS.length,
        totalElements: ALL_CHANNELS.length,
      }),
    );
  }

  const page = Number(pageParam);

  return channelPageResponse(
    createChannelPage(createPageChannels(page), {
      number: page,
      totalElements: DEFAULT_CHANNELS.length * TOTAL_PAGE_COUNT,
      totalPages: TOTAL_PAGE_COUNT,
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

function renderComparePage(searchParams = '') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const NuqsTestingAdapter = withNuqsTestingAdapter({ searchParams, hasMemory: true });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NuqsTestingAdapter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NuqsTestingAdapter>
    );
  }

  return render(<ComparePage />, { wrapper: Wrapper });
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
    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) =>
        defaultChannelResponse(new URL(request.url)),
      ),
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

  it('여러 카테고리를 정확히 필터링하고 첫 페이지로 돌아간다', async () => {
    const unpagedRequests: URL[] = [];

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        const url = new URL(request.url);

        if (!url.searchParams.has('page') && !url.searchParams.has('size')) {
          unpagedRequests.push(url);
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
      expect(unpagedRequests.length).toBeGreaterThan(0);
    });
    expect(screen.getByRole('checkbox', { name: '교육 선택' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '쇼핑·커머스 선택' })).toBeChecked();
    expect(screen.getByRole('button', { name: '페이지 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('네이버 검색 광고')).toBeVisible();
    expect(screen.getByText('카카오 키워드 광고')).toBeVisible();
    expect(unpagedRequests[0]?.searchParams.has('page')).toBe(false);
    expect(unpagedRequests[0]?.searchParams.has('size')).toBe(false);
  });

  it('기타 선택 시 API의 OTHERS 카테고리를 그대로 필터링한다', async () => {
    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    const categoryDropdown = screen.getByRole('combobox', { name: '채널 카테고리' });
    await user.click(categoryDropdown);
    await user.click(await screen.findByRole('option', { name: /기타/ }));

    expect(categoryDropdown).toHaveTextContent('기타');
    expect(await screen.findByText('카카오 채널 메시지')).toBeVisible();
    expect(screen.queryByText('네이버 검색 광고')).not.toBeInTheDocument();
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
              error: { code: 'CH-500', message: '채널 조회 실패', fieldErrors: [] },
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

  it('3개 선택 시 CTA를 활성화하고 임시 토스트를 보여준다', async () => {
    const user = userEvent.setup();
    renderComparePage();
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(getChannelCheckbox('카카오 키워드 광고'));
    await user.click(getChannelCheckbox('메타 피드 광고'));

    expect(getCompareButton()).toBeEnabled();

    await user.click(getCompareButton());

    expect(showWarningToastMock).toHaveBeenCalledWith('채널 비교 기능은 준비 중이에요.', {
      id: 'compare-coming-soon',
    });
  });

  it('기존 channels query에서 선택을 복원하지 않는다', async () => {
    renderComparePage('?channels=channel-meta,unknown,channel-kakao,channel-youtube,channel-naver');
    expect(await screen.findByText('네이버 검색 광고')).toBeVisible();

    expect(getChannelCheckbox('메타 피드 광고')).not.toBeChecked();
    expect(getChannelCheckbox('카카오 키워드 광고')).not.toBeChecked();
    expect(getChannelCheckbox('유튜브 영상 광고')).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });
});
