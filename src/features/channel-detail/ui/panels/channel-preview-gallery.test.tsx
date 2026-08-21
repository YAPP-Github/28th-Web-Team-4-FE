import { createElement, type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';

import { ChannelPreviewGallery } from './channel-preview-gallery';

vi.mock('next/image', () => ({
  default: ({ fill: _fill, sizes: _sizes, ...props }: ComponentProps<'img'> & { fill?: boolean }) =>
    createElement('img', props),
}));

describe('ChannelPreviewGallery', () => {
  it('전달받은 예시 이미지를 모두 표시한다', () => {
    render(
      <ChannelPreviewGallery
        channelName="메타 광고"
        imageUrls={['/preview-one.png', '/preview-two.png']}
      />,
    );

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });
});
