import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  MOCK_COMPARE_RESULT_CHANNELS,
  type CompareResultChannel,
} from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelPerformance } from './compare-result-channel-performance';

function createChannel(
  id: string,
  metrics: Pick<CompareResultChannel, 'impressions' | 'clicks'>,
): CompareResultChannel {
  return {
    ...MOCK_COMPARE_RESULT_CHANNELS[0],
    id,
    name: `${id} 채널`,
    ...metrics,
  };
}

const AVAILABLE_IMPRESSIONS = {
  value: '10,000~20,000회',
  fillPercentage: 50,
  available: true,
} as const;

const AVAILABLE_CLICKS = {
  value: '100~200회',
  fillPercentage: 100,
  available: true,
} as const;

const UNAVAILABLE_METRIC = {
  value: '확인 불가',
  fillPercentage: 0,
  available: false,
} as const;

describe('CompareResultChannelPerformance', () => {
  it('선택한 지표에 맞는 채널별 예상 범위를 표시한다', async () => {
    const user = userEvent.setup();

    render(<CompareResultChannelPerformance channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    expect(screen.getByRole('region', { name: '채널별 예상 노출 · 클릭 수' })).toBeVisible();
    expect(screen.getByText('120,000~180,000회')).toBeVisible();
    expect(screen.getByText('200,000~300,000회')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '클릭 수' }));

    expect(screen.getAllByText('1,800~2,700회')).toHaveLength(2);
  });

  it('예상 수치의 계산 기준을 팝오버로 안내한다', async () => {
    const user = userEvent.setup();

    render(<CompareResultChannelPerformance channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    const trigger = screen.getByRole('button', { name: '예상 수치 계산 안내' });

    await user.click(trigger);

    const popover = await screen.findByRole('dialog');

    expect(popover).toHaveTextContent('예상 수치는 어떻게 계산되나요?');
    expect(popover).toHaveTextContent(
      '입력하신 예산 기준으로 예상 클릭 수와 노출 수를 산출했어요.',
    );

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('안내 버튼을 hover해도 팝오버를 표시한다', async () => {
    const user = userEvent.setup();

    render(<CompareResultChannelPerformance channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    await user.hover(screen.getByRole('button', { name: '예상 수치 계산 안내' }));

    expect(await screen.findByRole('dialog')).toHaveTextContent('예상 수치는 어떻게 계산되나요?');
  });

  it('확인 불가 지표는 12px 트랙과 8px 빈 막대로 표시한다', () => {
    const { container } = render(
      <CompareResultChannelPerformance
        channels={[
          createChannel('뉴스캐시', {
            impressions: UNAVAILABLE_METRIC,
            clicks: AVAILABLE_CLICKS,
          }),
        ]}
      />,
    );

    const unavailableValue = screen.getByText('확인 불가', { selector: '[aria-hidden="false"]' });
    const track = container.querySelector('[data-availability="unavailable"]');
    const emptyBar = track?.firstElementChild;

    expect(unavailableValue).toHaveClass('typo-body-sm', 'text-text-low');
    expect(track).toHaveClass('h-012', 'bg-surface-low', 'rounded-[var(--radius-xxs)]');
    expect(emptyBar).toHaveClass('h-012', 'w-008', 'bg-sys-empty', 'rounded-[var(--radius-xxs)]');
  });

  it('노출과 클릭의 확인 불가 상태를 독립적으로 표시한다', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CompareResultChannelPerformance
        channels={[
          createChannel('노출-없음', {
            impressions: UNAVAILABLE_METRIC,
            clicks: AVAILABLE_CLICKS,
          }),
          createChannel('클릭-없음', {
            impressions: AVAILABLE_IMPRESSIONS,
            clicks: UNAVAILABLE_METRIC,
          }),
        ]}
      />,
    );

    expect(container.querySelectorAll('[data-availability="unavailable"]')).toHaveLength(1);
    expect(screen.getByText('확인 불가', { selector: '[aria-hidden="false"]' })).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '클릭 수' }));

    expect(container.querySelectorAll('[data-availability="unavailable"]')).toHaveLength(1);
    expect(screen.getByText('확인 불가', { selector: '[aria-hidden="false"]' })).toBeVisible();
  });

  it('모든 채널의 활성 지표가 확인 불가여도 전체 행을 유지한다', () => {
    const channels = ['채널-A', '채널-B', '채널-C'].map((id) =>
      createChannel(id, {
        impressions: UNAVAILABLE_METRIC,
        clicks: UNAVAILABLE_METRIC,
      }),
    );
    const { container } = render(<CompareResultChannelPerformance channels={channels} />);

    expect(container.querySelectorAll('[data-availability="unavailable"]')).toHaveLength(3);
    expect(screen.getAllByText('확인 불가', { selector: '[aria-hidden="false"]' })).toHaveLength(3);
    expect(screen.getByText('채널-A 채널')).toBeVisible();
    expect(screen.getByText('채널-B 채널')).toBeVisible();
    expect(screen.getByText('채널-C 채널')).toBeVisible();
  });
});
