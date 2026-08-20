import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CURRENT_SIMULATOR_TUTORIAL_VERSION,
  SIMULATOR_TUTORIAL_STORAGE_KEY,
} from '@/pages/simulator/model/simulator-tutorial';

import { SimulatorTutorialGate } from './simulator-tutorial-gate';

vi.mock('./simulator-tutorial-modal', () => ({
  SimulatorTutorialModal: ({
    open,
    onOpenChange,
    onCompleted,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCompleted: () => void;
  }) => {
    if (!open) {
      return <div data-testid="closed-tutorial" />;
    }

    return (
      <div role="dialog" aria-label="예산 시뮬레이션 튜토리얼">
        <button type="button" onClick={onCompleted}>
          튜토리얼 완료
        </button>
        <button type="button" onClick={() => onOpenChange(false)}>
          닫기
        </button>
      </div>
    );
  },
}));

describe('SimulatorTutorialGate', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders nothing before the client effect checks storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');

    const html = renderToString(<SimulatorTutorialGate />);

    expect(html).toBe('');
    expect(getItem).not.toHaveBeenCalled();
  });

  it('does not load the modal for the current version', async () => {
    window.localStorage.setItem(SIMULATOR_TUTORIAL_STORAGE_KEY, CURRENT_SIMULATOR_TUTORIAL_VERSION);

    render(<SimulatorTutorialGate />);

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '예산 시뮬레이션 튜토리얼' }),
      ).not.toBeInTheDocument();
    });
  });

  it('stores the current version only after the tutorial is completed', async () => {
    const user = userEvent.setup();

    render(<SimulatorTutorialGate />);

    expect(await screen.findByRole('dialog', { name: '예산 시뮬레이션 튜토리얼' })).toBeVisible();
    expect(window.localStorage.getItem(SIMULATOR_TUTORIAL_STORAGE_KEY)).toBeNull();

    await user.click(screen.getByRole('button', { name: '튜토리얼 완료' }));

    expect(window.localStorage.getItem(SIMULATOR_TUTORIAL_STORAGE_KEY)).toBe(
      CURRENT_SIMULATOR_TUTORIAL_VERSION,
    );
  });

  it('does not reopen after it is closed', async () => {
    const user = userEvent.setup();

    render(<SimulatorTutorialGate />);

    await user.click(await screen.findByRole('button', { name: '닫기' }));

    expect(
      screen.queryByRole('dialog', { name: '예산 시뮬레이션 튜토리얼' }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('closed-tutorial')).toBeInTheDocument();
    expect(window.localStorage.getItem(SIMULATOR_TUTORIAL_STORAGE_KEY)).toBeNull();
  });
});
