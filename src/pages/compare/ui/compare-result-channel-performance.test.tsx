import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelPerformance } from './compare-result-channel-performance';

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
});
