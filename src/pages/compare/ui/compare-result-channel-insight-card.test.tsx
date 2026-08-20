/** 채널 인사이트 카드 세 안이 같은 모델 데이터를 표현하는지 검증한다. */

import { render, screen, within } from '@testing-library/react';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import {
  COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
  CompareResultChannelInsightCard,
} from './compare-result-channel-insight-card';

describe('CompareResultChannelInsightCard', () => {
  it.each(COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS)(
    '%s 안에서 채널명, 키워드, 장점을 모두 보여준다',
    (variant) => {
      const channel = MOCK_COMPARE_RESULT_CHANNELS[0];

      render(<CompareResultChannelInsightCard channel={channel} variant={variant} />);

      const card = screen.getByRole('article', { name: channel.name });

      expect(within(card).getByRole('heading', { name: channel.name })).toBeVisible();
      expect(within(card).getByText(/KPI 최적/)).toBeVisible();
      expect(within(card).getByText(/입문자 추천/)).toBeVisible();
      expect(within(card).getByText(channel.insight.advantages[0])).toBeVisible();
      expect(within(card).queryByText('추천 이유')).not.toBeInTheDocument();
    },
  );

  it('split 카드에서 모든 장점을 보여준다', () => {
    const channel = {
      ...MOCK_COMPARE_RESULT_CHANNELS[0],
      insight: {
        ...MOCK_COMPARE_RESULT_CHANNELS[0].insight,
        advantages: ['첫 번째 장점', '두 번째 장점', '세 번째 장점'],
      },
    };

    render(<CompareResultChannelInsightCard channel={channel} variant="split" />);

    const card = screen.getByRole('article', { name: channel.name });

    expect(within(card).getByText('첫 번째 장점')).toBeVisible();
    expect(within(card).getByText('두 번째 장점')).toBeVisible();
    expect(within(card).getByText('세 번째 장점')).toBeVisible();
  });
});
