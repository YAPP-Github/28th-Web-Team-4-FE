import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RecommendResultTutorialModal } from './recommend-result-tutorial-modal';

const emblaMock = vi.hoisted(() => {
  type EventName = 'select' | 'reInit';
  type EventListener = (api: EmblaApiMock) => void;
  type EmblaApiMock = {
    selectedScrollSnap: () => number;
    on: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    off: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    scrollNext: (jump?: boolean) => void;
    scrollPrev: (jump?: boolean) => void;
  };

  let selectedIndex = 0;
  const listeners = new Map<EventName, Set<EventListener>>();
  const options = vi.fn<(options: unknown) => void>();

  const api: EmblaApiMock = {
    selectedScrollSnap: () => selectedIndex,
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
      selectedIndex = Math.min(selectedIndex + 1, 2);
      listeners.get('select')?.forEach((listener) => listener(api));
    },
    scrollPrev: () => {
      selectedIndex = Math.max(selectedIndex - 1, 0);
      listeners.get('select')?.forEach((listener) => listener(api));
    },
  };

  return {
    api,
    options,
    reset: () => {
      selectedIndex = 0;
      listeners.clear();
      options.mockClear();
    },
  };
});

vi.mock('embla-carousel-react', () => ({
  default: (options: unknown) => {
    emblaMock.options(options);
    return [vi.fn<(node: HTMLElement | null) => void>(), emblaMock.api] as const;
  },
}));

describe('RecommendResultTutorialModal', () => {
  beforeEach(() => {
    emblaMock.reset();
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query): MediaQueryList =>
        ({
          matches: query === '(prefers-reduced-motion)',
          media: query,
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => false,
        }) satisfies MediaQueryList,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('presents three non-looping tutorial steps and closes from the final CTA', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const onCompleted = vi.fn<() => void>();

    render(
      <RecommendResultTutorialModal open onOpenChange={onOpenChange} onCompleted={onCompleted} />,
    );

    const firstDialog = await screen.findByRole('dialog', {
      name: '비교하고 싶은 채널을 선택해 보세요',
    });
    await waitFor(() => expect(firstDialog).toHaveFocus());
    expect(
      within(firstDialog).getByRole('button', { name: '다음 튜토리얼 보기' }),
    ).not.toHaveFocus();
    expect(onCompleted).not.toHaveBeenCalled();
    expect(
      within(firstDialog).queryByRole('button', { name: '이전 튜토리얼 보기' }),
    ).not.toBeInTheDocument();
    const imageViewport = within(firstDialog).getByTestId('recommend-result-tutorial-viewport');
    const pagination = within(firstDialog).getByTestId('recommend-result-tutorial-pagination');
    expect(imageViewport).not.toContainElement(pagination);
    expect(pagination).toHaveClass('mx-auto', 'w-fit');
    expect(within(firstDialog).getByTestId('recommend-result-tutorial-content-height')).toHaveClass(
      'overflow-hidden',
    );
    expect(within(imageViewport).queryByText('비교하고 싶은 채널을 선택해 보세요')).toBeNull();

    await user.click(within(firstDialog).getByRole('button', { name: '다음 튜토리얼 보기' }));
    expect(onCompleted).not.toHaveBeenCalled();

    const secondDialog = screen.getByRole('dialog', {
      name: '추천된 결과를 마이페이지에 저장해요',
    });
    expect(within(secondDialog).getByTestId('recommend-result-tutorial-pagination')).toBe(
      pagination,
    );
    expect(within(secondDialog).getByTestId('recommend-result-tutorial-active-dot')).toHaveStyle({
      transform: 'translate3d(18px, 0, 0)',
    });
    expect(within(secondDialog).getByRole('button', { name: '이전 튜토리얼 보기' })).toBeVisible();
    expect(within(secondDialog).getByRole('button', { name: '다음 튜토리얼 보기' })).toBeVisible();

    await user.click(within(secondDialog).getByRole('button', { name: '다음 튜토리얼 보기' }));
    expect(onCompleted).not.toHaveBeenCalled();

    const finalDialog = screen.getByRole('dialog', {
      name: '선택한 채널들을 한눈에 비교해 보세요',
    });
    expect(
      within(finalDialog).queryByRole('button', { name: '다음 튜토리얼 보기' }),
    ).not.toBeInTheDocument();

    await user.click(within(finalDialog).getByRole('button', { name: '계속하기' }));
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
  });

  it('excludes inactive slides and disables dragging for reduced motion', async () => {
    render(
      <RecommendResultTutorialModal
        open
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onCompleted={vi.fn<() => void>()}
      />,
    );

    await screen.findByRole('dialog', { name: '비교하고 싶은 채널을 선택해 보세요' });

    const inactiveSlide = document.querySelector('[aria-label="2 / 3"]');
    expect(inactiveSlide).toHaveAttribute('aria-hidden', 'true');
    expect(inactiveSlide).toHaveAttribute('inert');
    expect(emblaMock.options).toHaveBeenCalledWith({
      align: 'start',
      dragFree: false,
      loop: false,
      skipSnaps: false,
      watchDrag: false,
    });

    const images = document.querySelectorAll('img');
    expect(images).toHaveLength(3);

    for (const image of images) {
      expect(image).toHaveAttribute('width', '876');
      expect(image).toHaveAttribute('height', '600');
    }
  });
});
