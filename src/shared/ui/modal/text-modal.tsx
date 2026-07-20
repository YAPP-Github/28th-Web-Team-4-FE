'use client';

import type { JSX, ReactNode } from 'react';

import { Box } from '@/shared/ui/layout/box';

import { Modal } from './modal';

export type TextModalProps = {
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  className?: string;
};

export const TextModal = ({
  title,
  description,
  actions,
  className,
}: TextModalProps): JSX.Element => {
  return (
    <Modal.Portal>
      <Modal.Backdrop />
      <Modal.Popup className={className ?? 'gap-024 px-030 pb-024 pt-030 items-start'}>
        <Box className="gap-012 flex w-full flex-col items-center text-center">
          <Modal.Title>{title}</Modal.Title>
          <Modal.Description>{description}</Modal.Description>
        </Box>
        <Box className="gap-010 flex w-full">{actions}</Box>
      </Modal.Popup>
    </Modal.Portal>
  );
};
