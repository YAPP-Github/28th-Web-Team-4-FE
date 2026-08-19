import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SimulatorChannelSelectionPage } from './simulator-channel-selection-page';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/features/channel-selection', () => ({
  ChannelSelectionScreen: ({
    title,
    submitLabel,
    selectionLimit,
    onComplete,
  }: {
    title: string;
    submitLabel: string;
    selectionLimit?: number;
    onComplete: (channelIds: readonly string[]) => void;
  }) => (
    <div>
      <h1>{title}</h1>
      <button
        type="button"
        onClick={() =>
          onComplete(selectionLimit === 1 ? ['channel-d'] : ['channel-a', 'channel-b', 'channel-c'])
        }
      >
        {submitLabel}
      </button>
    </div>
  ),
}));

describe('SimulatorChannelSelectionPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it('선택 화면의 제목과 실행 버튼을 보여준다', () => {
    render(<SimulatorChannelSelectionPage />);

    expect(
      screen.getByRole('heading', { name: '시뮬레이션할 채널을 선택해 주세요' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '시뮬레이션 실행하기' })).toBeVisible();
  });

  it('선택한 채널 ID를 반복 search param으로 시뮬레이터에 전달한다', async () => {
    const user = userEvent.setup();

    render(<SimulatorChannelSelectionPage />);
    await user.click(screen.getByRole('button', { name: '시뮬레이션 실행하기' }));

    expect(pushMock).toHaveBeenCalledWith(
      '/simulator?channelIds=channel-a&channelIds=channel-b&channelIds=channel-c',
    );
  });

  it('기존 채널을 유지한 채 하나의 채널을 추가한다', async () => {
    const user = userEvent.setup();

    render(<SimulatorChannelSelectionPage existingChannelIds={['channel-a', 'channel-b']} />);

    expect(screen.getByRole('heading', { name: '추가할 채널을 선택해 주세요' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: '채널 추가하기' }));

    expect(pushMock).toHaveBeenCalledWith(
      '/simulator?channelIds=channel-a&channelIds=channel-b&channelIds=channel-d&filterOpen=true',
    );
  });
});
