import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SimulatorTutorialModal } from './simulator-tutorial-modal';

vi.mock('embla-carousel-react', () => ({
  default: () => [vi.fn<(node: HTMLElement | null) => void>(), null] as const,
}));

describe('SimulatorTutorialModal', () => {
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

  it('renders the first budget simulation tutorial slide', async () => {
    render(
      <SimulatorTutorialModal
        open
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onCompleted={vi.fn<() => void>()}
      />,
    );

    expect(
      await screen.findByRole('dialog', { name: '채널을 추가하고 예상 성과를 확인해요' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '다음 튜토리얼 보기' })).toBeVisible();
  });
});
