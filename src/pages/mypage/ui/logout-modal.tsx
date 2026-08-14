'use client';

import type { JSX } from 'react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Modal, TextModal } from '@/shared/ui/modal';

type LogoutModalProps = {
  errorMessage?: string;
  isPending: boolean;
  onLogout: () => void;
};

const modalClassName = 'gap-024 px-030 pb-024 pt-030 items-center';

function QuestionMark(): JSX.Element {
  return (
    <Box
      aria-hidden="true"
      className="bg-surface-high text-text-lowest font-pre text-24 size-036 flex items-center justify-center rounded-full leading-[34px] font-semibold"
    >
      ?
    </Box>
  );
}

function ModalTitle({ children }: { children: string }): JSX.Element {
  return (
    <span className="flex w-full flex-col items-center gap-[18px]">
      <QuestionMark />
      <span>{children}</span>
    </span>
  );
}

export function LogoutModal({ errorMessage, isPending, onLogout }: LogoutModalProps): JSX.Element {
  return (
    <TextModal
      className={modalClassName}
      title={<ModalTitle>정말 로그아웃하시겠어요?</ModalTitle>}
      description={
        <>
          언제든 다시 로그인해서 저장된 결과를
          <br aria-hidden />
          확인할 수 있어요.
          {errorMessage ? (
            <span className="typo-body-sm text-sys-error-default mt-012 block" role="alert">
              {errorMessage}
            </span>
          ) : null}
        </>
      }
      actions={
        <>
          <Modal.CloseButton
            frame="button"
            tone="stroke"
            className="h-12 flex-1"
            disabled={isPending}
          >
            취소
          </Modal.CloseButton>
          <Button
            frame="button"
            tone="secondary"
            size="m"
            className="h-12 flex-1"
            disabled={isPending}
            onClick={onLogout}
          >
            로그아웃
          </Button>
        </>
      }
    />
  );
}
