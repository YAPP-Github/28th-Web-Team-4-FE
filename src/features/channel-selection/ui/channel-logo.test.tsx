import { fireEvent, render, screen } from '@testing-library/react';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';

import { ChannelLogo } from './channel-logo';

const CHANNEL: ChannelListItem = {
  id: 'channel-naver',
  name: '네이버 검색 광고',
  iconUrl: '/placeholder-g-search.svg',
  description: '네이버 검색 광고 설명',
  primaryCategory: 'OTHERS',
};

describe('ChannelLogo', () => {
  it('로고를 장식 이미지로 표시한다', () => {
    render(<ChannelLogo channel={CHANNEL} />);

    expect(screen.getByRole('presentation')).toBeVisible();
  });

  it('로고 로드에 실패하면 채널명의 첫 글자를 표시한다', () => {
    render(<ChannelLogo channel={CHANNEL} />);

    fireEvent.error(screen.getByRole('presentation'));

    expect(screen.getByText('네')).toBeVisible();
  });
});
