'use client';

import type { JSX } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

type WithdrawalModalProps = {
  errorMessage?: string;
  isPending: boolean;
  onWithdraw: () => void;
};

export function WithdrawalModal({
  errorMessage,
  isPending,
  onWithdraw,
}: WithdrawalModalProps): JSX.Element {
  return (
    <Modal.Portal>
      <Modal.Backdrop />
      <Modal.Popup className="px-030 pb-024 pt-040 items-center">
        <Box className="gap-028 flex w-full flex-col items-center">
          <Box className="relative h-[191px] w-[235px] shrink-0 overflow-clip">
            <Image
              src="/mypage-assets/withdraw-illustration.svg"
              alt=""
              width={198}
              height={123}
              unoptimized
              className="absolute top-[calc(50%+3.69px)] left-[calc(50%+0.15px)] h-[122.38px] w-[197.805px] -translate-x-1/2 -translate-y-1/2"
            />
          </Box>
          <Box className="gap-012 flex w-full flex-col items-center justify-center text-center">
            <Modal.Title>채소집을 정말 떠나시겠어요?</Modal.Title>
            <Modal.Description>
              <span className="flex flex-col">
                <span>지금 탈퇴하면 그동안 보관된 맞춤 매체 정보와</span>
                <span>저장 내역이 모두 사라져요.</span>
              </span>
              {errorMessage ? (
                <span className="typo-body-sm text-sys-error-default mt-012 block" role="alert">
                  {errorMessage}
                </span>
              ) : null}
            </Modal.Description>
          </Box>
          <Box className="gap-012 flex w-full flex-col items-start">
            <Modal.CloseButton
              frame="button"
              tone="secondary"
              size="m"
              className="h-12 w-full"
              disabled={isPending}
            >
              돌아가기
            </Modal.CloseButton>
            <button
              type="button"
              className={cn([
                'inline-flex h-[22px] items-center justify-center self-center px-002',
                'cursor-pointer text-text-medium transition-colors hover:text-text-high',
                'focus-visible:text-text-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ])}
              disabled={isPending}
              onClick={onWithdraw}
            >
              <Text variant="subtitle-xxs">탈퇴하기</Text>
            </button>
          </Box>
        </Box>
      </Modal.Popup>
    </Modal.Portal>
  );
}
