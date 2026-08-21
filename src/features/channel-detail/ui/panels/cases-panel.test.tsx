import { render, screen } from '@testing-library/react';

import { CHANNEL_DETAIL_FIXTURE } from '@/features/channel-detail/model/channel-detail-fixture';

import { ChannelDetailCasesPanel } from './cases-panel';

describe('ChannelDetailCasesPanel', () => {
  it('예시 이미지가 있으면 갤러리를 표시한다', () => {
    render(<ChannelDetailCasesPanel channel={CHANNEL_DETAIL_FIXTURE} />);

    expect(screen.getAllByRole('img')).toHaveLength(CHANNEL_DETAIL_FIXTURE.previewImageUrls.length);
    expect(screen.queryByText('내셔널지오그래픽')).not.toBeInTheDocument();
  });

  it('예시 이미지가 없으면 집행 사례를 표시한다', () => {
    render(
      <ChannelDetailCasesPanel channel={{ ...CHANNEL_DETAIL_FIXTURE, previewImageUrls: [] }} />,
    );

    expect(screen.getByText('내셔널지오그래픽')).toBeVisible();
  });

  it('예시 이미지와 집행 사례가 모두 없으면 빈 상태를 표시한다', () => {
    render(
      <ChannelDetailCasesPanel
        channel={{ ...CHANNEL_DETAIL_FIXTURE, previewImageUrls: [], similarCases: [] }}
      />,
    );

    expect(screen.getByText('등록된 광고 예시가 없습니다.')).toBeVisible();
  });
});
