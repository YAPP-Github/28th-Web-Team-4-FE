import * as Sentry from '@sentry/nextjs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RecommendResultError } from './recommend-result-error';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn<typeof Sentry.captureException>(),
}));

const captureExceptionMock = vi.mocked(Sentry.captureException);

describe('RecommendResultError', () => {
  it('reports the route error and retries recommendation loading', async () => {
    const user = userEvent.setup();
    const error = new Error('recommendation failed');
    const unstableRetry = vi.fn<() => void>();

    render(<RecommendResultError error={error} unstable_retry={unstableRetry} />);

    expect(screen.getByText('추천 결과를 불러오지 못했어요')).toBeVisible();
    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      tags: {
        boundary: 'next-route',
        feature: 'recommend-result',
        operation: 'render',
      },
    });

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(unstableRetry).toHaveBeenCalledOnce();
  });
});
