'use client';

import type { JSX, ReactNode } from 'react';
import { Stack } from '@/shared/ui/layout/stack';
import { Modal } from '@/shared/ui/modal';

export type ChannelDetailModalProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit?: () => void;
};

/**
 * Figma 채널 상세 모달 박스 모델
 * - width: 840
 * - padding: spacing/030
 * - header ↔ tabs 간격: spacing/020
 * - height: hug (viewport 초과 시만 스크롤)
 */
export function ChannelDetailModal({
  children,
  open,
  onOpenChange,
  onExit,
}: ChannelDetailModalProps): JSX.Element {
  return (
    <Modal.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          onExit?.();
        }
      }}
    >
      <Modal.Portal>
        <Modal.Backdrop />
        <Modal.Popup
          aria-label="채널 상세 정보"
          className="max-h-[90dvh] w-[840px] max-w-[calc(100vw-32px)] gap-0 overflow-y-auto p-0"
        >
          <Stack className="gap-020 p-030 w-full shrink-0 items-stretch">{children}</Stack>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
