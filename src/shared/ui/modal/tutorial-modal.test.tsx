import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';
import { TutorialModal, type TutorialSlide } from './tutorial-modal';

const TUTORIAL_SLIDES: readonly [TutorialSlide, ...TutorialSlide[]] = [
  {
    id: 'first',
    title: '첫 번째 단계',
    description: ['첫 줄 설명입니다.', '둘째 줄 설명입니다.'],
    imageSrc: '/recommend-result-assets/tutorial/select-channels@2x.png',
  },
  {
    id: 'second',
    title: '두 번째 단계',
    description: ['첫 줄 설명입니다.', '둘째 줄 설명입니다.'],
    imageSrc: '/recommend-result-assets/tutorial/save-result@2x.png',
  },
  {
    id: 'last',
    title: '마지막 단계',
    description: ['첫 줄 설명입니다.', '둘째 줄 설명입니다.'],
    imageSrc: '/recommend-result-assets/tutorial/compare-channels@2x.png',
  },
];

const emblaMock = vi.hoisted(() => {
  type EventName = 'select' | 'reInit';
  type EventListener = (api: EmblaApiMock) => void;
  type EmblaApiMock = {
    selectedScrollSnap: () => number;
    on: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    off: (eventName: EventName, listener: EventListener) => EmblaApiMock;
    scrollNext: () => void;
    scrollPrev: () => void;
  };

  let selectedIndex = 0;
  const listeners = new Map<EventName, Set<EventListener>>();

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
    reset: () => {
      selectedIndex = 0;
      listeners.clear();
    },
  };
});

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn<(node: HTMLElement | null) => void>(), emblaMock.api] as const,
}));

describe('TutorialModal', () => {
  beforeEach(() => {
    emblaMock.reset();
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query): MediaQueryList =>
        ({
          matches: query.includes('prefers-reduced-motion'),
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

  it('lets the user move through slides and finish from the last step', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const onCompleted = vi.fn<() => void>();

    render(
      <Modal.Root open onOpenChange={onOpenChange}>
        <TutorialModal
          slides={TUTORIAL_SLIDES}
          completeLabel="계속하기"
          liveRegionLabel="튜토리얼"
          onCompleted={onCompleted}
        />
      </Modal.Root>,
    );

    const dialog = await screen.findByRole('dialog', { name: '첫 번째 단계' });
    expect(within(dialog).getByRole('button', { name: '다음 튜토리얼 보기' })).toBeVisible();
    expect(
      within(dialog).queryByRole('button', { name: '이전 튜토리얼 보기' }),
    ).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: '다음 튜토리얼 보기' }));
    expect(screen.getByRole('dialog', { name: '두 번째 단계' })).toBeVisible();
    expect(screen.getByRole('button', { name: '이전 튜토리얼 보기' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '다음 튜토리얼 보기' }));
    expect(screen.getByRole('dialog', { name: '마지막 단계' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '다음 튜토리얼 보기' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '계속하기' }));
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
  });
});
