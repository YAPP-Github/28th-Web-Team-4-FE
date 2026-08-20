import type { ReactNode } from 'react';
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

const removeChannelMock = vi.fn<(channelId: string) => void>();

function renderChannelCards(
  channels: readonly CompareResultChannelSummary[] = MOCK_CHANNELS,
  removeDisabled = false,
  addChannelSlot: ReactNode = null,
  readOnly = false,
) {
  return render(
    <CompareResultChannelCards
      addChannelSlot={addChannelSlot}
      channels={channels}
      readOnly={readOnly}
      removeDisabled={removeDisabled}
      onRemoveChannel={removeChannelMock}
    />,
  );
}

describe('CompareResultChannelCards', () => {
  beforeEach(() => {
    removeChannelMock.mockReset();
  });

  it('목 채널 3개의 이름과 적합도를 카드로 표시한다', () => {
    renderChannelCards();

    expect(screen.getByRole('heading', { name: '네이버 검색 광고' })).toBeVisible();
    expect(screen.getByText('적합도 95%')).toBeVisible();
    expect(screen.getByRole('heading', { name: '카카오 키워드 광고' })).toBeVisible();
    expect(screen.getByText('적합도 88%')).toBeVisible();
    expect(screen.getByRole('heading', { name: '메타 피드 광고' })).toBeVisible();
    expect(screen.getByText('적합도 82%')).toBeVisible();
    expect(screen.queryByText('채널 추가하기')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /비교에서 제거/ })).toHaveLength(3);
    expect(
      screen.getByRole('heading', { name: '네이버 검색 광고' }).closest('article'),
    ).toHaveClass('cursor-pointer');
    expect(screen.getByRole('button', { name: '네이버 검색 광고 비교에서 제거' })).toHaveClass(
      'cursor-pointer',
    );
  });

  it('채널 제거 버튼으로 선택한 채널 ID를 전달한다', () => {
    renderChannelCards();

    fireEvent.click(screen.getByRole('button', { name: '네이버 검색 광고 비교에서 제거' }));

    expect(removeChannelMock).toHaveBeenCalledWith('naver');
  });

  it('후속 조회 중에는 채널 제거 버튼을 비활성화한다', () => {
    renderChannelCards(MOCK_CHANNELS, true);

    for (const button of screen.getAllByRole('button', { name: /비교에서 제거/ })) {
      expect(button).toBeDisabled();
    }
  });

  it('채널 추가 slot을 제공하면 제거 버튼 없이 표시한다', () => {
    renderChannelCards(
      MOCK_CHANNELS.slice(0, 2),
      false,
      <button type="button">채널 추가하기</button>,
    );

    expect(screen.getByText('채널 추가하기')).toBeVisible();
    expect(screen.queryByRole('button', { name: /비교에서 제거/ })).not.toBeInTheDocument();
  });

  it('읽기 전용이면 제거 버튼과 채널 추가 slot을 표시하지 않는다', () => {
    renderChannelCards(MOCK_CHANNELS, false, <button type="button">채널 추가하기</button>, true);

    expect(screen.queryByRole('button', { name: /비교에서 제거/ })).not.toBeInTheDocument();
    expect(screen.queryByText('채널 추가하기')).not.toBeInTheDocument();
  });

  it('임시 로고가 없는 채널은 채널명의 첫 글자를 표시한다', () => {
    renderChannelCards([
      {
        id: 'unknown-channel',
        name: '새로운 채널',
        matchRate: 70,
        logoSrc: null,
      },
      MOCK_CHANNELS[0],
    ]);

    expect(screen.getByText('새')).toBeVisible();
  });

  it('적합도가 없는 채널은 적합도 배지를 표시하지 않는다', () => {
    renderChannelCards([{ ...MOCK_CHANNELS[0], matchRate: null }, MOCK_CHANNELS[1]]);

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
    const { container } = renderChannelCards(MOCK_CHANNELS.slice(0, 2));
    const logo = container.querySelector('img');

    if (!logo) {
      throw new Error('네이버 검색 광고 로고를 찾지 못했습니다.');
    }

    fireEvent.error(logo);

    expect(screen.getByText('네')).toBeVisible();
  });
});
