import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '@/shared/ui/button';
import { GraphicModal, Modal, TextModal } from '@/shared/ui/modal';

const meta = {
  title: 'components/Modal',
  tags: ['autodocs'],
  args: {
    onPrimaryClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="bg-surface-high flex min-h-80 w-full items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<{ onPrimaryClick: () => void }>;

export default meta;
type Story = StoryObj<typeof meta>;

const GraphicModalExample = ({ onPrimaryClick }: { onPrimaryClick: () => void }) => (
  <Modal.Root>
    <Modal.Trigger
      render={
        <Button frame="button" tone="secondary" size="m">
          그래픽 모달 열기
        </Button>
      }
    />
    <GraphicModal
      title="첫 방문인가요?"
      description={
        <>
          입력하신 이메일로 가입된 계정이 없습니다.
          <br />
          회원 가입을 진행할까요?
        </>
      }
      actions={
        <>
          <Modal.CloseButton
            frame="button"
            tone="secondary"
            size="m"
            className="h-12 w-full"
            onClick={onPrimaryClick}
          >
            회원 가입하기
          </Modal.CloseButton>
          <Modal.CloseText>돌아가기</Modal.CloseText>
        </>
      }
    />
  </Modal.Root>
);

const TextModalExample = () => (
  <Modal.Root>
    <Modal.Trigger
      render={
        <Button frame="button" tone="secondary" size="m">
          텍스트 모달 열기
        </Button>
      }
    />
    <TextModal
      title="추천받은 기록이 있어요"
      description={
        <>
          이전에 추천받은 채널들을 바탕으로 예산을 계산하거나,
          <br />
          새로운 조건으로 처음부터 다시 시작할 수 있어요.
        </>
      }
      actions={
        <>
          <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
            새로 입력하기
          </Modal.CloseButton>
          <Modal.CloseButton frame="button" tone="secondary" size="m" className="h-12 flex-1">
            기존 결과 가져오기
          </Modal.CloseButton>
        </>
      }
    />
  </Modal.Root>
);

const ControlledModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Button frame="button" tone="secondary" size="m" onClick={() => setOpen(true)}>
        제어 모달 열기
      </Button>
      <TextModal
        title="추천받은 기록이 있어요"
        description={
          <>
            이전에 추천받은 채널들을 바탕으로 예산을 계산하거나,
            <br />
            새로운 조건으로 처음부터 다시 시작할 수 있어요.
          </>
        }
        actions={
          <>
            <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
              새로 입력하기
            </Modal.CloseButton>
            <Modal.CloseButton frame="button" tone="secondary" size="m" className="h-12 flex-1">
              기존 결과 가져오기
            </Modal.CloseButton>
          </>
        }
      />
    </Modal.Root>
  );
};

export const Graphic: Story = {
  render: (args) => <GraphicModalExample onPrimaryClick={args.onPrimaryClick} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '그래픽 모달 열기' }));

    const body = within(document.body);
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: '첫 방문인가요?' })).toBeVisible();
    });
    await expect(body.getByText('회원 가입하기')).toBeVisible();

    await userEvent.click(body.getByRole('button', { name: '회원 가입하기' }));
    await expect(args.onPrimaryClick).toHaveBeenCalled();
  },
};

export const Text: Story = {
  render: () => <TextModalExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '텍스트 모달 열기' }));

    const body = within(document.body);
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: '추천받은 기록이 있어요' })).toBeVisible();
    });
    await expect(body.getByRole('button', { name: '새로 입력하기' })).toBeVisible();
    await expect(body.getByRole('button', { name: '기존 결과 가져오기' })).toBeVisible();
  },
};

export const Controlled: Story = {
  render: () => <ControlledModalExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: '제어 모달 열기' }));

    const body = within(document.body);
    await waitFor(async () => {
      await expect(body.getByRole('dialog', { name: '추천받은 기록이 있어요' })).toBeVisible();
    });

    await userEvent.click(body.getByRole('button', { name: '기존 결과 가져오기' }));
    await waitFor(async () => {
      await expect(
        body.queryByRole('dialog', { name: '추천받은 기록이 있어요' }),
      ).not.toBeInTheDocument();
    });
  },
};
