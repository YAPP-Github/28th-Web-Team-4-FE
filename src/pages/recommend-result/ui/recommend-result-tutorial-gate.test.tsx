import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
  RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY,
} from '@/pages/recommend-result/model/recommend-result-tutorial';

import { RecommendResultTutorialGate } from './recommend-result-tutorial-gate';

vi.mock('./recommend-result-tutorial-modal', () => ({
  RecommendResultTutorialModal: ({
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
      <div role="dialog" aria-label="추천 결과 튜토리얼">
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

describe('RecommendResultTutorialGate', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders nothing before the client effect checks storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');

    const html = renderToString(<RecommendResultTutorialGate />);

    expect(html).toBe('');
    expect(getItem).not.toHaveBeenCalled();
  });

  it('does not load the modal for the current version', async () => {
    window.localStorage.setItem(
      RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY,
      CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
    );

    render(<RecommendResultTutorialGate />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '추천 결과 튜토리얼' })).not.toBeInTheDocument();
    });
  });

  it('stores the current version only after the tutorial is completed', async () => {
    const user = userEvent.setup();

    render(<RecommendResultTutorialGate />);

    expect(await screen.findByRole('dialog', { name: '추천 결과 튜토리얼' })).toBeVisible();
    expect(window.localStorage.getItem(RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY)).toBeNull();

    await user.click(screen.getByRole('button', { name: '튜토리얼 완료' }));

    expect(window.localStorage.getItem(RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY)).toBe(
      CURRENT_RECOMMEND_RESULT_TUTORIAL_VERSION,
    );
  });

  it('does not reopen after it is closed', async () => {
    const user = userEvent.setup();

    render(<RecommendResultTutorialGate />);

    await user.click(await screen.findByRole('button', { name: '닫기' }));

    expect(screen.queryByRole('dialog', { name: '추천 결과 튜토리얼' })).not.toBeInTheDocument();
    expect(screen.getByTestId('closed-tutorial')).toBeInTheDocument();
    expect(window.localStorage.getItem(RECOMMEND_RESULT_TUTORIAL_STORAGE_KEY)).toBeNull();
  });
});
