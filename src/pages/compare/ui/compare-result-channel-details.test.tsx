import { render, screen, within } from '@testing-library/react';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelDetailsTable } from './compare-result-channel-details';

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
});
