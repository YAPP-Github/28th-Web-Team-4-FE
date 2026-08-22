import { MutationObserver } from '@tanstack/react-query';

import { getQueryClient } from './query-client';
import { captureQueryError } from './sentry/error-reporting';

vi.mock('./sentry/error-reporting', () => ({
  captureQueryError: vi.fn<typeof captureQueryError>(),
}));

const captureQueryErrorMock = vi.mocked(captureQueryError);

describe('query client error reporting', () => {
  it('reports final query and mutation failures through the global caches', async () => {
    const queryClient = getQueryClient();
    const queryError = new Error('query failed');
    const mutationError = new Error('mutation failed');
    const queryFn = vi.fn<() => Promise<never>>(() => Promise.reject(queryError));

    await expect(
      queryClient.fetchQuery({
        queryKey: ['sentry-query-test'],
        queryFn,
        retry: 2,
      }),
    ).rejects.toBe(queryError);

    const mutationObserver = new MutationObserver(queryClient, {
      mutationFn: () => Promise.reject(mutationError),
    });

    await expect(mutationObserver.mutate()).rejects.toBe(mutationError);

    expect(queryFn).toHaveBeenCalledTimes(3);
    expect(captureQueryErrorMock).toHaveBeenCalledTimes(2);
    expect(captureQueryErrorMock).toHaveBeenNthCalledWith(1, queryError, 'query');
    expect(captureQueryErrorMock).toHaveBeenNthCalledWith(2, mutationError, 'mutation');
  });
});
