import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelDetailsTable } from './compare-result-channel-details';

function mockClampedText(element: HTMLElement): void {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, get: () => 120 });
  Object.defineProperty(element, 'clientHeight', { configurable: true, get: () => 40 });
}

describe('CompareResultChannelDetailsTable', () => {
  it('선택한 채널의 상세 정보를 항목별로 비교한다', () => {
    render(<CompareResultChannelDetailsTable channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    expect(screen.getByRole('region', { name: '채널별 상세 정보' })).toBeVisible();

    const table = screen.getByRole('table', { name: '선택한 채널의 상세 정보 비교' });

    expect(within(table).getByRole('columnheader', { name: '네이버 검색 광고' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: '카카오 키워드 광고' })).toBeVisible();

    expect(within(table).getByRole('rowheader', { name: /최소 광고비/ })).toHaveTextContent(
      '얼마부터 집행 가능한지',
    );
    expect(within(table).getByText('200,000원')).toBeVisible();
    expect(within(table).getByText('100,000원')).toBeVisible();
    expect(within(table).getByText('20~40대 여성')).toBeVisible();
    expect(within(table).getByText('전 연령 국내 사용자')).toBeVisible();
    expect(within(table).getByText('배너 · 피드 · 릴스')).toBeVisible();
    expect(within(table).getByText('배너 · 네이티브 · 동영상')).toBeVisible();
    expect(within(table).getByText('관심사 · 행동 · 유사 타깃')).toBeVisible();
    expect(within(table).getByText('카카오 데이터 · 지역')).toBeVisible();
  });

  it('잘린 상세 값에 호버하면 전체 문구 툴팁을 보여준다', async () => {
    const user = userEvent.setup();
    const longAudience =
      '20~40대 직장인, 육아 중인 여성, 건강기능식품에 관심이 많은 반복 구매 고객과 신규 유입 사용자';

    render(
      <CompareResultChannelDetailsTable
        channels={[
          {
            ...MOCK_COMPARE_RESULT_CHANNELS[0],
            details: {
              ...MOCK_COMPARE_RESULT_CHANNELS[0].details,
              primaryAudience: longAudience,
            },
          },
        ]}
      />,
    );

    const value = screen.getByText(longAudience);
    mockClampedText(value);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(value);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(longAudience);

    await user.unhover(value);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('잘리지 않은 상세 값에는 호버해도 툴팁을 보여주지 않는다', async () => {
    const user = userEvent.setup();
    render(<CompareResultChannelDetailsTable channels={MOCK_COMPARE_RESULT_CHANNELS} />);

    await user.hover(screen.getByText('20~40대 여성'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
