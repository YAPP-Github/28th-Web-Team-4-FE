'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';

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

export const GraphicModalGraphic = ({
  className,
  ...props
}: GraphicModalGraphicProps): JSX.Element => {
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
        <Box className="gap-032 flex w-full flex-col items-center">
          {graphic}
          <Box className="gap-036 flex w-full flex-col items-center">
            <Box className="gap-012 flex w-[276px] flex-col items-center text-center">
              <Modal.Title>{title}</Modal.Title>
              <Modal.Description>{description}</Modal.Description>
            </Box>
            <Box className="gap-008 flex w-full flex-col">{actions}</Box>
          </Box>
        </Box>
      </Modal.Popup>
    </Modal.Portal>
  );
};
