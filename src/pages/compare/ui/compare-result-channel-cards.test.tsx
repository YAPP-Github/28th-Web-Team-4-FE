import { fireEvent, render, screen, within } from '@testing-library/react';

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

  it('적합도가 없는 채널은 적합도 배지를 표시하지 않는다', () => {
    render(
      <CompareResultChannelCards
        channels={[{ ...MOCK_CHANNELS[0], matchRate: null }, MOCK_CHANNELS[1]]}
      />,
    );

    const channelCard = screen
      .getByRole('heading', { name: '네이버 검색 광고' })
      .closest('article');

    if (!channelCard) {
      throw new Error('네이버 검색 광고 카드를 찾지 못했습니다.');
    }

    expect(within(channelCard).queryByText(/^적합도/)).not.toBeInTheDocument();
    expect(screen.getByText('적합도 88%')).toBeVisible();
  });

  it('로고 이미지 로드가 실패하면 채널명의 첫 글자를 표시한다', () => {
    const { container } = render(
      <CompareResultChannelCards channels={MOCK_CHANNELS.slice(0, 2)} />,
    );
    const logo = container.querySelector('img');

    if (!logo) {
      throw new Error('네이버 검색 광고 로고를 찾지 못했습니다.');
    }

    fireEvent.error(logo);

    expect(screen.getByText('네')).toBeVisible();
  });
});
