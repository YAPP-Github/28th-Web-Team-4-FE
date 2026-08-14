/** 채널별 인사이트 섹션의 기본 렌더링과 접기 상호작용을 검증한다. */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelInsights } from './compare-result-channel-insights';

describe('CompareResultChannelInsights', () => {
  it('선택한 채널의 인사이트를 기본으로 펼쳐서 보여준다', () => {
    render(<CompareResultChannelInsights channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    const region = screen.getByRole('region', { name: '채널별 인사이트' });
    const trigger = within(region).getByRole('button', { name: '채널별 인사이트' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(region).getByRole('article', { name: '네이버 검색 광고' })).toBeVisible();
    expect(within(region).getByRole('article', { name: '카카오 키워드 광고' })).toBeVisible();
  });

  it('접으면 첫 번째 인사이트만 남기고 다시 펼치면 전체를 보여준다', async () => {
    const user = userEvent.setup();

    render(<CompareResultChannelInsights channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    const region = screen.getByRole('region', { name: '채널별 인사이트' });
    const trigger = within(region).getByRole('button', { name: '채널별 인사이트' });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(region).getByRole('article', { name: '네이버 검색 광고' })).toBeVisible();
    expect(
      within(region).queryByRole('article', { name: '카카오 키워드 광고' }),
    ).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(region).getByRole('article', { name: '네이버 검색 광고' })).toBeVisible();
    expect(within(region).getByRole('article', { name: '카카오 키워드 광고' })).toBeVisible();
  });

  it('제목만 남기는 접힘 방식에서는 모든 인사이트 카드를 숨긴다', async () => {
    const user = userEvent.setup();

    render(
      <CompareResultChannelInsights
        channels={MOCK_COMPARE_RESULT_CHANNELS}
        collapsedView="title"
      />,
    );

    const region = screen.getByRole('region', { name: '채널별 인사이트' });

    await user.click(within(region).getByRole('button', { name: '채널별 인사이트' }));

    expect(within(region).queryAllByRole('article')).toHaveLength(0);
  });
});
