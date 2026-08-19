import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  RecommendResultTutorialModal,
  type RecommendResultTutorialModalProps,
} from './recommend-result-tutorial-modal';

const FIRST_TITLE = '비교하고 싶은 채널을 선택해 보세요';
const SECOND_TITLE = '추천된 결과를 마이페이지에 저장해요';
const THIRD_TITLE = '선택한 채널들을 한눈에 비교해 보세요';

function TutorialModalStory(props: RecommendResultTutorialModalProps) {
  const [open, setOpen] = useState(true);

  return <RecommendResultTutorialModal {...props} open={open} onOpenChange={setOpen} />;
}

async function dragToNextSlide(pointer: 'mouse' | 'touch'): Promise<void> {
  const body = within(document.body);
  const viewport = await body.findByTestId('recommend-result-tutorial-viewport');
  const { left, right, top, height } = viewport.getBoundingClientRect();
  const start = { clientX: right - 48, clientY: top + height / 2 };
  const middle = { clientX: left + (right - left) / 2, clientY: top + height / 2 };
  const end = { clientX: left + 48, clientY: top + height / 2 };

  if (pointer === 'mouse') {
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: viewport, coords: start },
      { pointerName: 'mouse', target: viewport, coords: middle },
      { pointerName: 'mouse', target: viewport, coords: end },
      { keys: '[/MouseLeft]', target: viewport, coords: end },
    ]);
    return;
  }

  const createTouch = (coords: { clientX: number; clientY: number }): Touch =>
    new Touch({
      identifier: 1,
      target: viewport,
      clientX: coords.clientX,
      clientY: coords.clientY,
      pageX: coords.clientX,
      pageY: coords.clientY,
      screenX: coords.clientX,
      screenY: coords.clientY,
    });
  const dispatchTouch = (type: 'touchstart' | 'touchmove' | 'touchend', touch?: Touch): void => {
    viewport.dispatchEvent(
      new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: touch ? [touch] : [],
        changedTouches: touch ? [touch] : [],
      }),
    );
  };
  const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  dispatchTouch('touchstart', createTouch(start));
  await nextFrame();
  dispatchTouch('touchmove', createTouch(middle));
  await nextFrame();
  dispatchTouch('touchmove', createTouch(end));
  await nextFrame();
  dispatchTouch('touchend', createTouch(end));
}

const meta = {
  title: 'pages/recommend-result/TutorialModal',
  component: RecommendResultTutorialModal,
  args: {
    open: true,
    onOpenChange: fn(),
    onPresented: fn(),
  },
  render: (args) => <TutorialModalStory {...args} />,
} satisfies Meta<typeof RecommendResultTutorialModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReducedMotion: Story = {
  beforeEach: () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = (query: string): MediaQueryList => ({
      matches: query === '(prefers-reduced-motion)',
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    });

    return () => {
      window.matchMedia = originalMatchMedia;
    };
  },
  play: async () => {
    const body = within(document.body);
    await expect(await body.findByRole('dialog', { name: FIRST_TITLE })).toBeVisible();

    await dragToNextSlide('mouse');
    await expect(body.getByRole('dialog', { name: FIRST_TITLE })).toBeVisible();

    await userEvent.click(body.getByRole('button', { name: '다음 튜토리얼 보기' }));
    await expect(body.getByRole('dialog', { name: SECOND_TITLE })).toBeVisible();
  },
};

export const MouseDrag: Story = {
  play: async () => {
    const body = within(document.body);
    const firstDialog = await body.findByRole('dialog', { name: FIRST_TITLE });
    await expect(firstDialog).toBeVisible();
    const firstImage = firstDialog.querySelector('img');

    if (!firstImage) {
      throw new Error('튜토리얼 이미지를 찾을 수 없습니다.');
    }

    await expect(firstImage.getBoundingClientRect().width).toBe(438);
    await expect(firstImage.getBoundingClientRect().height).toBe(300);
    await expect(
      within(firstDialog).queryByRole('button', { name: '이전 튜토리얼 보기' }),
    ).not.toBeInTheDocument();
    const pagination = body.getByTestId('recommend-result-tutorial-pagination');
    const paginationLeft = pagination.getBoundingClientRect().left;
    const activeDot = body.getByTestId('recommend-result-tutorial-active-dot');
    const nextButton = within(firstDialog).getByRole('button', { name: '다음 튜토리얼 보기' });
    const dialogCenter = firstDialog.getBoundingClientRect().top + firstDialog.offsetHeight / 2;
    const buttonCenter = nextButton.getBoundingClientRect().top + nextButton.offsetHeight / 2;
    await expect(Math.abs(dialogCenter - buttonCenter)).toBeLessThanOrEqual(1);
    await expect(pagination.getBoundingClientRect().width).toBe(48);
    await expect(activeDot.getBoundingClientRect().left).toBe(paginationLeft);
    await expect(window.getComputedStyle(activeDot).transitionDuration).toBe('0.18s');

    await dragToNextSlide('mouse');

    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: SECOND_TITLE })).toBeVisible();
    });
    await expect(pagination.getBoundingClientRect().left).toBe(paginationLeft);
    await expect(window.getComputedStyle(pagination).transform).toBe('none');
    await expect(activeDot.style.transform).toBe('translate3d(18px, 0px, 0px)');

    const contentHeight = body.getByTestId('recommend-result-tutorial-content-height');
    const previousHeight = contentHeight.getBoundingClientRect().height;
    await userEvent.click(body.getByRole('button', { name: '다음 튜토리얼 보기' }));
    await expect(body.getByRole('dialog', { name: THIRD_TITLE })).toBeVisible();
    const measuredContent = contentHeight.firstElementChild;

    if (!measuredContent) {
      throw new Error('튜토리얼 콘텐츠 측정 영역을 찾을 수 없습니다.');
    }

    const targetHeight = measuredContent.getBoundingClientRect().height;
    await expect(targetHeight).toBeGreaterThan(previousHeight);
    await expect(contentHeight.getBoundingClientRect().height).toBeLessThan(targetHeight);
    await waitFor(async () => {
      await expect(
        Math.abs(contentHeight.getBoundingClientRect().height - targetHeight),
      ).toBeLessThanOrEqual(1);
    });
    await expect(
      body.queryByRole('button', { name: '다음 튜토리얼 보기' }),
    ).not.toBeInTheDocument();

    await dragToNextSlide('mouse');
    await expect(body.getByRole('dialog', { name: THIRD_TITLE })).toBeVisible();
  },
};

export const MobilePointerSwipe: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async () => {
    const body = within(document.body);
    await expect(await body.findByRole('dialog', { name: FIRST_TITLE })).toBeVisible();

    const viewport = body.getByTestId('recommend-result-tutorial-viewport');
    const track = viewport.firstElementChild;
    const dialog = body.getByRole('dialog', { name: FIRST_TITLE });
    const image = dialog.querySelector('img');

    if (!track || !image) {
      throw new Error('튜토리얼 캐러셀 요소를 찾을 수 없습니다.');
    }

    await expect(window.getComputedStyle(track).touchAction).toBe('pan-y pinch-zoom');
    await expect(
      image.getBoundingClientRect().width / image.getBoundingClientRect().height,
    ).toBeCloseTo(876 / 600, 2);
    await expect(
      body.getByRole('button', { name: '다음 튜토리얼 보기' }).getBoundingClientRect().right,
    ).toBeLessThanOrEqual(dialog.getBoundingClientRect().right);

    await dragToNextSlide('touch');

    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: SECOND_TITLE })).toBeVisible();
    });
  },
};
