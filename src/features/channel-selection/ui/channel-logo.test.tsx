import { fireEvent, render, screen } from '@testing-library/react';

import type { ChannelListItem } from '@/features/channel-selection/model/channel-page';

import { ChannelLogo } from './channel-logo';

const CHANNEL: ChannelListItem = {
  id: 'channel-naver',
  name: '네이버 검색 광고',
  logoUrl: '/placeholder-g-search.svg',
  description: '네이버 검색 광고 설명',
  primaryCategory: 'OTHERS',
};

describe('ChannelLogo', () => {
  it('로고를 장식 이미지로 표시한다', () => {
    const { container } = render(<ChannelLogo channel={CHANNEL} />);

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('width', '33');
    expect(image).toHaveAttribute('height', '33');
  });

  it('로고 로드에 실패하면 채널명의 첫 글자를 표시한다', () => {
    const { container } = render(<ChannelLogo channel={CHANNEL} />);

    const image = container.querySelector('img');
    if (!image) {
      throw new Error('채널 로고 이미지를 찾지 못했습니다.');
    }

    fireEvent.error(image);

    expect(screen.getByText('네')).toBeVisible();
  });

  it('선택 목록 변형은 28px 원형 로고를 사용한다', () => {
    const { container } = render(<ChannelLogo channel={CHANNEL} variant="selected" />);

    expect(container.firstChild).toHaveClass('size-028', 'rounded-[var(--radius-max)]');
    expect(container.querySelector('img')).toHaveAttribute('width', '28');
  });
});
