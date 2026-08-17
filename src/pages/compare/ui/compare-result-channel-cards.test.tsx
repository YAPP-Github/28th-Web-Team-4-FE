import { render, screen } from '@testing-library/react';

import type { CompareResultChannelSummary } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelCards } from './compare-result-channel-cards';

const MOCK_CHANNELS = [
  {
    id: 'naver',
    name: '네이버 검색 광고',
    matchRate: 95,
    logoSrc: '/compare-assets/naver.png',
  },
  {
    id: 'kakao',
    name: '카카오 키워드 광고',
    matchRate: 88,
    logoSrc: '/compare-assets/kakao.png',
  },
  {
    id: 'meta',
    name: '메타 피드 광고',
    matchRate: 82,
    logoSrc: '/compare-assets/meta.png',
  },
] as const satisfies readonly CompareResultChannelSummary[];

describe('CompareResultChannelCards', () => {
  it('목 채널 3개의 이름과 적합도를 카드로 표시한다', () => {
    render(<CompareResultChannelCards channels={MOCK_CHANNELS} />);

    expect(screen.getByRole('heading', { name: '네이버 검색 광고' })).toBeVisible();
    expect(screen.getByText('적합도 95%')).toBeVisible();
    expect(screen.getByRole('heading', { name: '카카오 키워드 광고' })).toBeVisible();
    expect(screen.getByText('적합도 88%')).toBeVisible();
    expect(screen.getByRole('heading', { name: '메타 피드 광고' })).toBeVisible();
    expect(screen.getByText('적합도 82%')).toBeVisible();
    expect(screen.queryByText('채널 추가하기')).not.toBeInTheDocument();
  });

  it('채널이 2개면 채널 추가 카드를 표시한다', () => {
    render(<CompareResultChannelCards channels={MOCK_CHANNELS.slice(0, 2)} />);

    expect(screen.getByText('채널 추가하기')).toBeVisible();
  });

  it('임시 로고가 없는 채널은 채널명의 첫 글자를 표시한다', () => {
    render(
      <CompareResultChannelCards
        channels={[
          {
            id: 'unknown-channel',
            name: '새로운 채널',
            matchRate: 70,
            logoSrc: null,
          },
          MOCK_CHANNELS[0],
        ]}
      />,
    );

    expect(screen.getByText('새')).toBeVisible();
  });
});
