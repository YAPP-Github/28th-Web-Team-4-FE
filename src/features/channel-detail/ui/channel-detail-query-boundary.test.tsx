import * as Sentry from '@sentry/nextjs';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChannelDetailQueryBoundary } from './channel-detail-query-boundary';

const testState = vi.hoisted(() => ({
  error: new Error('channel detail failed'),
  renderCount: 0,
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn<typeof Sentry.captureException>(),
}));
vi.mock('@/features/channel-detail/ui/channel-detail-query', () => ({
  ChannelDetailQuery: () => {
    testState.renderCount += 1;
    throw testState.error;
  },
}));

const captureExceptionMock = vi.mocked(Sentry.captureException);

describe('ChannelDetailQueryBoundary', () => {
  it('reports the error and retries the failed subtree', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<ChannelDetailQueryBoundary channelId="channel-1" fallback={<p>불러오는 중</p>} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('채널 정보를 불러오지 못했어요');
    expect(captureExceptionMock).toHaveBeenCalledWith(testState.error, {
      tags: {
        boundary: 'react-error-boundary',
        feature: 'channel-detail',
        operation: 'query-render',
      },
    });

    const captureCount = captureExceptionMock.mock.calls.length;
    const renderCount = testState.renderCount;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(testState.renderCount).toBeGreaterThan(renderCount));
    expect(captureExceptionMock).toHaveBeenCalledTimes(captureCount + 1);
  });
});
