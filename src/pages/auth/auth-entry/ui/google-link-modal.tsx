'use client';

import type { JSX } from 'react';

import { Button } from '@/shared/ui/button';
import { Modal, TextModal } from '@/shared/ui/modal';

type GoogleLinkModalProps = {
  open: boolean;
  errorMessage?: string;
  isPending: boolean;
  onConfirm: () => void;
  onDefer: () => void;
  onDismiss: () => void;
};

export function GoogleLinkModal({
  open,
  errorMessage,
  isPending,
  onConfirm,
  onDefer,
  onDismiss,
}: GoogleLinkModalProps): JSX.Element {
  return (
    <Modal.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onDismiss();
        }
      }}
    >
      <TextModal
        className="gap-024 px-030 pb-024 pt-030 items-center"
        title={
          <span className="flex flex-col items-center gap-[18px]">
            <span
              aria-hidden
              className="typo-heading-lg bg-surface-high text-text-lowest flex size-9 items-center justify-center rounded-full"
            >
              ?
            </span>
            <span>Google 계정을 연동할까요?</span>
          </span>
        }
        description={
          <>
            입력하신 이메일과 동일한 Google 계정이 있어요.
            <br />
            계정을 연동하고 간편하게 로그인해요.
            {errorMessage ? (
              <span className="typo-body-lg text-sys-error-default mt-012 block" role="alert">
                {errorMessage}
              </span>
            ) : null}
          </>
        }
        actions={
          <>
            <Button
              frame="button"
              tone="stroke"
              className="h-12 flex-1"
              disabled={isPending}
              onClick={onDefer}
            >
              나중에 하기
            </Button>
            <Button
              frame="button"
              tone="secondary"
              size="m"
              className="h-12 flex-1"
              disabled={isPending}
              onClick={onConfirm}
            >
              연동하기
            </Button>
          </>
        }
      />
    </Modal.Root>
  );
}
