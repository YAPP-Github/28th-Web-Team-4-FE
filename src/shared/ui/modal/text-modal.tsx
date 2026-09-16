'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';

import { Modal } from './modal';
import { Flex } from '@/shared/ui/layout/flex';
import { VStack } from '@/shared/ui/layout/v-stack';

export type TextModalProps = {
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  className?: string;
  backdropClassName?: ComponentProps<typeof Modal.Backdrop>['className'];
};

export const TextModal = ({
  title,
  description,
  actions,
  className,
  backdropClassName,
}: TextModalProps): JSX.Element => {
  return (
    <Modal.Portal>
      <Modal.Backdrop className={backdropClassName} />
      <Modal.Popup className={className ?? 'gap-024 px-030 pb-024 pt-030 items-start'}>
        <VStack className="gap-012 w-full text-center">
          <Modal.Title>{title}</Modal.Title>
          <Modal.Description>{description}</Modal.Description>
        </VStack>
        <Flex className="gap-010 w-full">{actions}</Flex>
      </Modal.Popup>
    </Modal.Portal>
  );
};
