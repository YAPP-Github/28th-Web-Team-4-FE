import { useState, type JSX } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  recommendedChannels,
  type RecommendedChannel,
} from '@/pages/recommend-result/model/recommended-channels';

import { RecommendedChannelCarousel } from './recommended-channel-carousel';

const TABLET_MEDIA_QUERY = '(min-width: 48rem)';
const SMALL_DESKTOP_MEDIA_QUERY = '(min-width: 64rem)';
const DESKTOP_MEDIA_QUERY = '(min-width: 80rem)';
const EMPTY_SELECTION: readonly string[] = [];

const emblaMock = vi.hoisted(() => {
  type EventName = 'select' | 'reInit';
  type EventListener = (api: EmblaApiMock) => void;
  type EmblaApiMock = {
    selectedScrollSnap: () => number;
    scrollSnapList: () => number[];
    on: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    off: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    scrollNext: (jump?: boolean) => void;
    scrollPrev: (jump?: boolean) => void;
    scrollTo: (index: number, jump?: boolean) => void;
  };

  let selectedIndex = 0;
  let options:
    | { containScroll?: false | 'trimSnaps' | 'keepSnaps'; watchDrag?: boolean }
    | undefined;
  const listeners = new Map<EventName, Set<EventListener>>();

  const emit = (eventName: EventName): void => {
    listeners.get(eventName)?.forEach((listener) => listener(api));
  };

  const api: EmblaApiMock = {
    selectedScrollSnap: () => selectedIndex,
    scrollSnapList: () => [],
    on: (eventName, listener) => {
      const eventListeners = listeners.get(eventName) ?? new Set<EventListener>();
      eventListeners.add(listener);
      listeners.set(eventName, eventListeners);
      return api;
    },
    off: (eventName, listener) => {
      listeners.get(eventName)?.delete(listener);
      return api;
    },
    scrollNext: () => {
      selectedIndex += 1;
      emit('select');
    },
    scrollPrev: () => {
      selectedIndex = Math.max(selectedIndex - 1, 0);
      emit('select');
    },
    scrollTo: (index) => {
      selectedIndex = index;
      emit('select');
    },
  };

  return {
    api,
    getOptions: () => options,
    reset: (): void => {
      selectedIndex = 0;
      options = undefined;
      listeners.clear();
    },
    setOptions: (
      nextOptions:
        | { containScroll?: false | 'trimSnaps' | 'keepSnaps'; watchDrag?: boolean }
        | undefined,
    ): void => {
      options = nextOptions;
    },
  };
});

vi.mock('embla-carousel-react', () => ({
  default: (options?: {
    containScroll?: false | 'trimSnaps' | 'keepSnaps';
    watchDrag?: boolean;
  }) => {
    emblaMock.setOptions(options);
    return [vi.fn<(node: HTMLElement | null) => void>(), emblaMock.api] as const;
  },
}));

function createMediaQueryList(query: string, matches: boolean): MediaQueryList {
  return {
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn<() => void>(),
    removeListener: vi.fn<() => void>(),
    addEventListener: vi.fn<() => void>(),
    removeEventListener: vi.fn<() => void>(),
    dispatchEvent: vi.fn<() => boolean>(() => false),
  } as MediaQueryList;
}

function mockViewport(columns: 1 | 2 | 3 | 4, prefersReducedMotion = true): void {
  vi.mocked(window.matchMedia).mockImplementation((query) =>
    createMediaQueryList(
      query,
      (query.includes('prefers-reduced-motion') && prefersReducedMotion) ||
        (query === TABLET_MEDIA_QUERY && columns >= 2) ||
        (query === SMALL_DESKTOP_MEDIA_QUERY && columns >= 3) ||
        (query === DESKTOP_MEDIA_QUERY && columns >= 4),
    ),
  );
}

function renderCarousel(
  channels: readonly RecommendedChannel[],
  options: { isGuest?: boolean } = {},
) {
  return render(
    <RecommendedChannelCarousel
      channels={channels}
      selectedChannelIds={EMPTY_SELECTION}
      isGuest={options.isGuest}
      onOpenDetail={vi.fn<(channel: RecommendedChannel) => void>()}
      onToggleSelection={vi.fn<(channelId: string) => void>()}
    />,
  );
}

function SelectionHarness(): JSX.Element {
  const [selectedChannelIds, setSelectedChannelIds] = useState<readonly string[]>([]);

  return (
    <RecommendedChannelCarousel
      channels={recommendedChannels}
      selectedChannelIds={selectedChannelIds}
      onOpenDetail={vi.fn<(channel: RecommendedChannel) => void>()}
      onToggleSelection={(channelId) => {
        setSelectedChannelIds((currentIds) =>
          currentIds.includes(channelId)
            ? currentIds.filter((id) => id !== channelId)
            : [...currentIds, channelId],
        );
      }}
    />
  );
}

describe('RecommendedChannelCarousel', () => {
  beforeEach(() => {
    emblaMock.reset();
    mockViewport(4);
  });

  it('does not render navigation controls for four channels', () => {
    renderCarousel(recommendedChannels.slice(0, 4));

    expect(screen.queryByRole('button', { name: '이전 추천 채널 보기' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다음 추천 채널 보기' })).not.toBeInTheDocument();
  });

  it('renders a single left-aligned channel on the second page for five channels', async () => {
    const user = userEvent.setup();
    renderCarousel(recommendedChannels.slice(0, 5));

    await user.click(screen.getByRole('button', { name: '다음 추천 채널 보기' }));

    const secondPage = screen.getByRole('group', { name: '2 / 2' });
    expect(within(secondPage).getAllByRole('article')).toHaveLength(1);
    expect(within(secondPage).getByRole('article', { name: '네이버 쇼핑 광고' })).toBeVisible();
  });

  it('renders pagination dots and updates the active page', async () => {
    const user = userEvent.setup();
    renderCarousel(recommendedChannels);

    const pagination = screen.getByRole('navigation', { name: '추천 채널 페이지' });
    const dots = within(pagination).getAllByRole('button');

    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveAttribute('aria-current', 'page');
    expect(dots[1]).not.toHaveAttribute('aria-current');

    await user.click(dots[1]);

    expect(dots[0]).not.toHaveAttribute('aria-current');
    expect(dots[1]).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('추천 채널 2 / 2 페이지')).toBeInTheDocument();
  });

  it('moves by four channels without wrapping at either boundary', async () => {
    const user = userEvent.setup();
    renderCarousel(recommendedChannels);

    const previousButton = screen.getByRole('button', { name: '이전 추천 채널 보기' });
    const nextButton = screen.getByRole('button', { name: '다음 추천 채널 보기' });
    const track = document.getElementById(nextButton.getAttribute('aria-controls') ?? '');

    expect(track).toHaveClass('gap-024');
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(screen.getByText('추천 채널 1 / 2 페이지')).toBeInTheDocument();

    await user.click(nextButton);

    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
    expect(screen.getByText('추천 채널 2 / 2 페이지')).toBeInTheDocument();

    await user.click(previousButton);

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(screen.getByText('추천 채널 1 / 2 페이지')).toBeInTheDocument();
  });

  it('keeps the first page tooltip mounted while that page moves offscreen', async () => {
    const user = userEvent.setup();
    renderCarousel(recommendedChannels);

    const nextButton = screen.getByRole('button', { name: '다음 추천 채널 보기' });
    const viewport = document.getElementById(
      nextButton.getAttribute('aria-controls') ?? '',
    )?.parentElement;

    expect(viewport).toHaveClass('-mt-[60px]', 'overflow-hidden', 'pt-[60px]');
    expect(screen.getByText('클릭당 비용이 가장 낮아요')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '다음 추천 채널 보기' }));

    expect(screen.getByText('클릭당 비용이 가장 낮아요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '이전 추천 채널 보기' }));

    expect(screen.getByText('클릭당 비용이 가장 낮아요')).toBeVisible();
  });

  it('makes only the active desktop page available to assistive technology', async () => {
    const user = userEvent.setup();
    renderCarousel(recommendedChannels);

    const firstPage = screen.getByRole('group', { name: '1 / 2' });
    const secondPage = document.querySelector<HTMLElement>('[aria-label="2 / 2"]');

    expect(firstPage).not.toHaveAttribute('inert');
    expect(secondPage).toHaveAttribute('inert');
    expect(secondPage).toHaveAttribute('aria-hidden', 'true');

    await user.click(screen.getByRole('button', { name: '다음 추천 채널 보기' }));

    expect(firstPage).toHaveAttribute('inert');
    expect(firstPage).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('group', { name: '2 / 2' })).not.toHaveAttribute('inert');
  });

  it('uses two channels per page at the tablet breakpoint', () => {
    mockViewport(2);
    renderCarousel(recommendedChannels);

    const pages = screen.getAllByRole('group', { hidden: true });
    expect(pages).toHaveLength(4);
    expect(within(pages[0]).getAllByRole('article', { hidden: true })).toHaveLength(2);
    expect(within(pages[3]).getAllByRole('article', { hidden: true })).toHaveLength(2);
  });

  it('uses three channels per page at the small desktop breakpoint', () => {
    mockViewport(3);
    renderCarousel(recommendedChannels);

    const pages = screen.getAllByRole('group', { hidden: true });
    expect(pages).toHaveLength(3);
    expect(within(pages[0]).getAllByRole('article', { hidden: true })).toHaveLength(3);
    expect(within(pages[2]).getAllByRole('article', { hidden: true })).toHaveLength(2);
  });

  it('keeps only the active page available at the mobile breakpoint', () => {
    mockViewport(1);
    renderCarousel(recommendedChannels);

    const pages = screen.getAllByRole('group', { hidden: true });
    expect(pages).toHaveLength(8);
    expect(pages[0]).not.toHaveAttribute('inert');

    expect(pages[1]).toHaveAttribute('inert');
    expect(pages[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('remaps the active page when the viewport changes column count', async () => {
    const user = userEvent.setup();
    const { rerender } = renderCarousel(recommendedChannels);

    await user.click(screen.getByRole('button', { name: '다음 추천 채널 보기' }));

    expect(screen.getByText('추천 채널 2 / 2 페이지')).toBeInTheDocument();

    mockViewport(1);
    rerender(
      <RecommendedChannelCarousel
        channels={recommendedChannels}
        selectedChannelIds={EMPTY_SELECTION}
        onOpenDetail={vi.fn<(channel: RecommendedChannel) => void>()}
        onToggleSelection={vi.fn<(channelId: string) => void>()}
      />,
    );

    const pages = screen.getAllByRole('group', { hidden: true });
    expect(pages).toHaveLength(8);
    expect(screen.getByText('추천 채널 5 / 8 페이지')).toBeInTheDocument();
    expect(pages[4]).not.toHaveAttribute('inert');
    expect(pages[0]).toHaveAttribute('inert');
  });

  it('enables drag when motion is allowed', () => {
    mockViewport(4, false);
    renderCarousel(recommendedChannels);

    expect(emblaMock.getOptions()?.watchDrag).toBe(true);
  });

  it('disables drag when the user prefers reduced motion', () => {
    renderCarousel(recommendedChannels);

    expect(emblaMock.getOptions()).toMatchObject({
      containScroll: false,
      watchDrag: false,
    });
  });

  it('preserves a selected channel after navigating away and back', async () => {
    const user = userEvent.setup();
    render(<SelectionHarness />);

    await user.click(screen.getByRole('checkbox', { name: '네이버 검색 광고 비교 목록 선택' }));
    await user.click(screen.getByRole('button', { name: '다음 추천 채널 보기' }));
    await user.click(screen.getByRole('button', { name: '이전 추천 채널 보기' }));

    expect(
      screen.getByRole('checkbox', { name: '네이버 검색 광고 비교 목록 선택' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('article', { name: '네이버 검색 광고' })).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  it.each([1, 2, 3, 4] as const)(
    'locks only the first two guest channels with %i channel per page',
    (columns) => {
      mockViewport(columns);
      renderCarousel(recommendedChannels, { isGuest: true });

      const articles = screen.getAllByRole('article', { hidden: true });

      expect(
        within(articles[0]).getByRole('link', { name: '로그인하기', hidden: true }),
      ).toBeInTheDocument();
      expect(
        within(articles[1]).getByRole('link', { name: '로그인하기', hidden: true }),
      ).toBeInTheDocument();

      for (const article of articles.slice(2)) {
        expect(
          within(article).queryByRole('link', { name: '로그인하기', hidden: true }),
        ).not.toBeInTheDocument();
      }
    },
  );

  it('uses the same guest locks when entrance motion is enabled', () => {
    mockViewport(4, false);
    renderCarousel(recommendedChannels, { isGuest: true });

    expect(screen.getAllByRole('link', { name: '로그인하기', hidden: true })).toHaveLength(2);
  });

  it('keeps every channel unlocked for authenticated users', () => {
    renderCarousel(recommendedChannels, { isGuest: false });

    expect(
      screen.queryByRole('link', { name: '로그인하기', hidden: true }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(
      recommendedChannels.length,
    );
    expect(screen.getAllByRole('button', { name: /상세 정보 열기/, hidden: true })).toHaveLength(
      recommendedChannels.length,
    );
  });

  it('locks only the available result when a guest receives one channel', () => {
    renderCarousel(recommendedChannels.slice(0, 1), { isGuest: true });

    expect(screen.getAllByRole('link', { name: '로그인하기' })).toHaveLength(1);
  });

  it('loads the first page images eagerly and the second page lazily', () => {
    renderCarousel(recommendedChannels);

    const images = [...document.querySelectorAll('img')];
    expect(images).toHaveLength(8);
    expect(images.slice(0, 4).every((image) => image.getAttribute('loading') === 'eager')).toBe(
      true,
    );
    expect(images.slice(4).every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
  });
});
