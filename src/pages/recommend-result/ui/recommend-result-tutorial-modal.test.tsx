import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RecommendResultTutorialModal } from './recommend-result-tutorial-modal';

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn<(node: HTMLElement | null) => void>(), null] as const,
}));

describe('RecommendResultTutorialModal', () => {
  beforeEach(() => {
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

  it('renders the recommend-result tutorial copy in the shared modal shell', async () => {
    render(
      <RecommendResultTutorialModal
        open
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onCompleted={vi.fn<() => void>()}
      />,
    );

    expect(
      await screen.findByRole('dialog', { name: '비교하고 싶은 채널을 선택해 보세요' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '다음 튜토리얼 보기' })).toBeVisible();
  });
});
