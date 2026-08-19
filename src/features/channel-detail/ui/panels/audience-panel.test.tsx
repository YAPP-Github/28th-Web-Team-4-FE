import { render, screen } from '@testing-library/react';

import { CHANNEL_DETAIL_FIXTURE } from '@/features/channel-detail/model/channel-detail-fixture';

import { ChannelDetailAudiencePanel } from './audience-panel';

describe('ChannelDetailAudiencePanel', () => {
  it('동적 오디언스 지표를 전달받은 순서대로 표시한다', () => {
    render(
      <ChannelDetailAudiencePanel
        channel={{
          ...CHANNEL_DETAIL_FIXTURE,
          audience: {
            ...CHANNEL_DETAIL_FIXTURE.audience,
            metrics: [
              { label: '주간 순사용자', value: '8만 명' },
              { label: '가입자 수', value: '24만 명' },
            ],
          },
        }}
      />,
    );

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      '주요 연령대',
      '주요 성별',
      '주간 순사용자',
      '가입자 수',
      '유저 특성',
    ]);
    expect(screen.getByText('8만 명')).toBeVisible();
    expect(screen.getByText('24만 명')).toBeVisible();
  });

  it('동적 지표가 없어도 기존 타깃층 정보는 표시한다', () => {
    render(
      <ChannelDetailAudiencePanel
        channel={{
          ...CHANNEL_DETAIL_FIXTURE,
          audience: { ...CHANNEL_DETAIL_FIXTURE.audience, metrics: [] },
        }}
      />,
    );

    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
      '주요 연령대',
      '주요 성별',
      '유저 특성',
    ]);
    expect(screen.getByText(CHANNEL_DETAIL_FIXTURE.audience.traits)).toBeVisible();
  });
});
