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
});
