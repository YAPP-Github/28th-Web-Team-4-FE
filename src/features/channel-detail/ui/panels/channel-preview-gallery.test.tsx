import { createElement, type ComponentProps } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@/shared/ui/modal';

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
    expect(screen.getByRole('list', { name: '메타 광고 광고 예시 이미지' })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /크게 보기/ })).toHaveLength(2);
  });

  it('선택한 이미지를 확대하고 닫은 뒤 해당 썸네일로 포커스를 돌려준다', async () => {
    const user = userEvent.setup();

    render(
      <ChannelPreviewGallery
        channelName="메타 광고"
        imageUrls={['/preview-one.png', '/preview-two.png']}
      />,
    );

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 2 크게 보기' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 2 크게 보기',
    });
    expect(within(dialog).getByRole('img', { name: '메타 광고 광고 예시 2' })).toBeVisible();

    const closeButton = within(dialog).getByRole('button', { name: '이미지 닫기' });
    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 2 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('Escape와 바깥 클릭으로 확대 이미지만 닫고 부모 모달은 유지한다', async () => {
    const user = userEvent.setup();

    render(
      <Modal.Root defaultOpen>
        <Modal.Portal>
          <Modal.Popup aria-label="채널 상세 정보">
            <ChannelPreviewGallery channelName="메타 광고" imageUrls={['/preview-one.png']} />
            <Modal.Close>채널 상세 닫기</Modal.Close>
          </Modal.Popup>
        </Modal.Portal>
      </Modal.Root>,
    );

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    expect(
      await screen.findByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
    ).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();

    await user.click(trigger);
    expect(
      await screen.findByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
    ).toBeVisible();

    await user.click(document.body);
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
  });
});
