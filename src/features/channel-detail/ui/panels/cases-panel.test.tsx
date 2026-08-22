import { render, screen } from '@testing-library/react';

import { CHANNEL_DETAIL_FIXTURE } from '@/features/channel-detail/model/channel-detail-fixture';

import { ChannelDetailCasesPanel } from './cases-panel';

describe('ChannelDetailCasesPanel', () => {
  it('집행 사례 아래에 예시 이미지 갤러리를 표시한다', () => {
    render(<ChannelDetailCasesPanel channel={CHANNEL_DETAIL_FIXTURE} />);

    const similarCases = screen.getByText('내셔널지오그래픽').closest('ul');
    const gallery = screen.getByRole('list', {
      name: `${CHANNEL_DETAIL_FIXTURE.name} 광고 예시 이미지`,
    });

    expect(similarCases).toBeVisible();
    expect(similarCases?.nextElementSibling).toBe(gallery);
    expect(screen.getAllByRole('img')).toHaveLength(CHANNEL_DETAIL_FIXTURE.previewImageUrls.length);
    expect(screen.queryByText('등록된 광고 예시가 없습니다.')).not.toBeInTheDocument();
  });

  it('집행 사례가 없으면 예시 이미지 갤러리만 표시한다', () => {
    render(<ChannelDetailCasesPanel channel={{ ...CHANNEL_DETAIL_FIXTURE, similarCases: [] }} />);

    expect(screen.getAllByRole('img')).toHaveLength(CHANNEL_DETAIL_FIXTURE.previewImageUrls.length);
    expect(screen.queryByText('내셔널지오그래픽')).not.toBeInTheDocument();
    expect(screen.queryByText('등록된 광고 예시가 없습니다.')).not.toBeInTheDocument();
  });

  it('예시 이미지가 없으면 집행 사례만 표시한다', () => {
    render(
      <ChannelDetailCasesPanel channel={{ ...CHANNEL_DETAIL_FIXTURE, previewImageUrls: [] }} />,
    );

    expect(screen.getByText('내셔널지오그래픽')).toBeVisible();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('등록된 광고 예시가 없습니다.')).not.toBeInTheDocument();
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
