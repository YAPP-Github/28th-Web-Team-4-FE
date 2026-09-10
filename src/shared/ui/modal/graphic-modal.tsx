'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';

import { Modal } from './modal';

export type GraphicModalGraphicProps = ComponentProps<typeof Box<'div'>>;

export type GraphicModalProps = {
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  graphic?: ReactNode;
  className?: string;
};

const graphicClassName =
  'min-h-[150px] w-[147px] shrink-0 rounded-[var(--radius-l)] bg-surface-low';

const GraphicModalGraphic = ({ className, ...props }: GraphicModalGraphicProps): JSX.Element => {
  return <Box className={cn(graphicClassName, className)} {...props} />;
};

export const GraphicModal = ({
  title,
  description,
  actions,
  graphic = <GraphicModalGraphic aria-hidden />,
  className,
}: GraphicModalProps): JSX.Element => {
  return (
    <Modal.Portal>
      <Modal.Backdrop />
      <Modal.Popup className={className ?? 'px-030 pb-024 pt-040 items-center'}>
        <VStack className="gap-032 w-full">
          {graphic}
          <VStack className="gap-036 w-full">
            <VStack className="gap-012 w-[276px] text-center">
              <Modal.Title>{title}</Modal.Title>
              <Modal.Description>{description}</Modal.Description>
            </VStack>
            <Stack className="gap-008 w-full">{actions}</Stack>
          </VStack>
        </VStack>
      </Modal.Popup>
    </Modal.Portal>
  );
};
