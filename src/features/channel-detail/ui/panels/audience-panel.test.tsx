/** 채널 상세 타깃층 패널의 지표 순서와 긴 유저 특성 레이아웃을 검증한다. */
import { render, screen } from '@testing-library/react';

import { CHANNEL_DETAIL_FIXTURE } from '@/features/channel-detail/model/channel-detail-fixture';

import { ChannelDetailAudiencePanel } from './audience-panel';

const LONG_AUDIENCE_TRAITS =
  '콘텐츠(영화·드라마·도서·웹툰)에 높은 관심을 가지고 주간 12회 이상 방문하며 별점·평가를 적극적으로 남기는 MZ세대 유저';

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
    const audienceTraits = screen.getByText(CHANNEL_DETAIL_FIXTURE.audience.traits);

    expect(audienceTraits).toBeVisible();
    expect(audienceTraits.parentElement).toHaveClass('h-auto', 'min-h-[96px]');
  });

  it('긴 유저 특성은 단어를 보존해 줄바꿈하고 카드 높이를 내용에 맞춘다', () => {
    render(
      <ChannelDetailAudiencePanel
        channel={{
          ...CHANNEL_DETAIL_FIXTURE,
          audience: {
            ...CHANNEL_DETAIL_FIXTURE.audience,
            traits: LONG_AUDIENCE_TRAITS,
          },
        }}
      />,
    );

    const audienceTraits = screen.getByText(LONG_AUDIENCE_TRAITS);
    const primaryAgeBand = screen.getByText(CHANNEL_DETAIL_FIXTURE.audience.primaryAgeBand);

    expect(audienceTraits).toBeVisible();
    expect(audienceTraits).toHaveClass('break-keep', '[overflow-wrap:anywhere]', 'max-w-[70%]');
    expect(audienceTraits.parentElement).toHaveClass('h-auto', 'min-h-[96px]');
    expect(audienceTraits.parentElement).not.toHaveClass('h-[96px]');
    expect(primaryAgeBand).not.toHaveClass('max-w-[70%]');
    expect(primaryAgeBand.parentElement).toHaveClass('h-[96px]');
  });
});
