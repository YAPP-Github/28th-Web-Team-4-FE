import { createElement, type ComponentProps } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '@/shared/ui/modal';

import { ChannelPreviewGallery } from './channel-preview-gallery';

vi.mock('next/image', () => ({
  default: ({
    fill: _fill,
    sizes: _sizes,
    unoptimized: _unoptimized,
    ...props
  }: ComponentProps<'img'> & {
    fill?: boolean;
    unoptimized?: boolean;
  }) => createElement('img', props),
}));

function renderGalleryInModal(): void {
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
}

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

    await user.click(within(dialog).getByRole('img', { name: '메타 광고 광고 예시 2' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 2 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('확대 이미지를 클릭하면 확대 보기만 닫고 썸네일로 포커스를 돌려준다', async () => {
    const user = userEvent.setup();

    renderGalleryInModal();

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 1 크게 보기',
    });
    const closeButton = within(dialog).getByRole('button', {
      name: '메타 광고 광고 예시 1 확대 보기 닫기',
    });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.click(within(dialog).getByRole('img', { name: '메타 광고 광고 예시 1' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it('Escape를 누르면 부모 모달은 유지하고 확대 보기만 닫는다', async () => {
    const user = userEvent.setup();

    renderGalleryInModal();

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 1 크게 보기',
    });
    const closeButton = within(dialog).getByRole('button', {
      name: '메타 광고 광고 예시 1 확대 보기 닫기',
    });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it('이미지 닫기 버튼에 포커스된 상태에서 Enter를 누르면 확대 보기를 닫는다', async () => {
    const user = userEvent.setup();

    renderGalleryInModal();

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 1 크게 보기',
    });
    const closeButton = within(dialog).getByRole('button', {
      name: '메타 광고 광고 예시 1 확대 보기 닫기',
    });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it('이미지 닫기 버튼에 포커스된 상태에서 Space를 누르면 확대 보기를 닫는다', async () => {
    const user = userEvent.setup();

    renderGalleryInModal();

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 1 크게 보기',
    });
    const closeButton = within(dialog).getByRole('button', {
      name: '메타 광고 광고 예시 1 확대 보기 닫기',
    });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.keyboard(' ');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it('배경 클릭으로 확대 이미지만 닫고 부모 모달은 유지한다', async () => {
    const user = userEvent.setup();

    renderGalleryInModal();

    await user.click(screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' }));
    await screen.findByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(document.body);

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: '채널 상세 정보' })).toBeVisible();
    // jsdom은 preventScroll 지원 감지에 실패해 Base UI가 바깥 클릭 후 포커스 복원을 생략한다.
    // 배경 클릭 후 포커스 복원은 실제 브라우저에서 검증한다.
  });

  it('원본 이미지가 로딩 중일 때 대체 썸네일을 클릭해도 닫힌다', async () => {
    const user = userEvent.setup();

    render(<ChannelPreviewGallery channelName="메타 광고" imageUrls={['/preview-one.png']} />);

    const thumbnail = screen.getByRole('img', { name: '메타 광고 광고 예시 1' });
    Object.defineProperty(thumbnail, 'currentSrc', { value: '/thumbnail-one.png' });
    fireEvent.load(thumbnail);

    const trigger = screen.getByRole('button', { name: '메타 광고 광고 예시 1 크게 보기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: '메타 광고 광고 예시 1 크게 보기',
    });

    await user.click(within(dialog).getByAltText(''));
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '메타 광고 광고 예시 1 크게 보기' }),
      ).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
