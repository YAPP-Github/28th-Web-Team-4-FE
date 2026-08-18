import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import { useChannelComparisonResultQueryState } from './use-channel-comparison-result-query-state';

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

function ResultQueryStateProbe() {
  const { channelIds, onboardingId, isValid, setChannelIds } =
    useChannelComparisonResultQueryState();

  return (
    <div>
      <output data-testid="channels">{channelIds.join(',')}</output>
      <output data-testid="onboarding-id">{onboardingId}</output>
      <output data-testid="valid">{String(isValid)}</output>
      <button type="button" onClick={() => void setChannelIds(['channel-a', 'channel-c'])}>
        채널 변경
      </button>
    </div>
  );
}

function renderResultQueryState(searchParams: string, onUrlUpdate: OnUrlUpdateFunction = () => {}) {
  return render(<ResultQueryStateProbe />, {
    wrapper: withNuqsTestingAdapter({
      searchParams,
      onUrlUpdate,
      hasMemory: true,
      resetUrlUpdateQueueOnMount: false,
    }),
  });
}

describe('useChannelComparisonResultQueryState', () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  it('URL 초기값에서 채널과 onboardingId를 읽는다', () => {
    renderResultQueryState('?channels=channel-a,channel-b&onboardingId=onboarding-87');

    expect(screen.getByTestId('channels')).toHaveTextContent('channel-a,channel-b');
    expect(screen.getByTestId('onboarding-id')).toHaveTextContent('onboarding-87');
    expect(screen.getByTestId('valid')).toHaveTextContent('true');
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('빈 값과 중복을 제거하고 최초 순서대로 최대 세 개를 replace한다', async () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderResultQueryState(
      '?channels=channel-a,,channel-a,channel-b,channel-c,channel-d&onboardingId=onboarding-87',
      onUrlUpdate,
    );

    expect(screen.getByTestId('channels')).toHaveTextContent('channel-a,channel-b,channel-c');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('channels')).toBe('channel-a,channel-b,channel-c');
    expect(event?.searchParams.get('onboardingId')).toBe('onboarding-87');
    expect(event?.options.history).toBe('replace');
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it.each(['', '?channels=channel-a', '?channels=channel-a,,channel-a'])(
    '정규화 후 채널이 한 개 이하면 /compare로 이동한다: %s',
    async (searchParams) => {
      renderResultQueryState(searchParams);

      expect(screen.getByTestId('valid')).toHaveTextContent('false');
      await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/compare'));
    },
  );

  it('채널 변경은 replace history를 사용하고 onboardingId를 보존한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderResultQueryState(
      '?channels=channel-a,channel-b,channel-c&onboardingId=onboarding-87',
      onUrlUpdate,
    );

    await user.click(screen.getByRole('button', { name: '채널 변경' }));

    expect(screen.getByTestId('channels')).toHaveTextContent('channel-a,channel-c');
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];
    expect(event?.searchParams.get('channels')).toBe('channel-a,channel-c');
    expect(event?.searchParams.get('onboardingId')).toBe('onboarding-87');
    expect(event?.options.history).toBe('replace');
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
