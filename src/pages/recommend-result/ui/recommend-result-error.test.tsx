import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RecommendResultError } from './recommend-result-error';

describe('RecommendResultError', () => {
  it('retries recommendation loading when the retry button is clicked', async () => {
    const user = userEvent.setup();
    const reset = vi.fn<() => void>();

    render(<RecommendResultError reset={reset} />);

    expect(screen.getByText('추천 결과를 불러오지 못했어요')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
