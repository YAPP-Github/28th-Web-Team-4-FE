import { render, screen } from '@testing-library/react';

import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';

import { ChannelDetailHeader } from './channel-detail-header';

const CHANNEL: ChannelDetailHeaderData = {
  id: 'channel-meta',
  name: '메타 광고',
  iconUrl: '/meta-logo.png',
  description: '목적에 맞는 정교한 타기팅 채널',
};

describe('ChannelDetailHeader', () => {
  it('로고를 불러오는 동안 프로필 placeholder 대신 스켈레톤을 표시한다', () => {
    const { container } = render(<ChannelDetailHeader channel={CHANNEL} />);

    expect(screen.getByRole('img', { name: '메타 광고 로고' })).toBeVisible();
    expect(screen.getByTestId('channel-detail-logo-skeleton')).toBeVisible();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
