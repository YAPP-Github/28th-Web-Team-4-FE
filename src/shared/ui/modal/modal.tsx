'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cva, type VariantProps } from 'class-variance-authority';

import { Button, type ButtonProps } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type ModalRootProps = DialogPrimitive.Root.Props;
type ModalTriggerProps = DialogPrimitive.Trigger.Props;
type ModalTitleProps = Omit<DialogPrimitive.Title.Props, 'className' | 'render'> & {
  className?: string;
};
type ModalDescriptionProps = Omit<DialogPrimitive.Description.Props, 'className' | 'render'> & {
  className?: string;
};
type ModalCloseProps = DialogPrimitive.Close.Props;

const backdropClassName = [
  'fixed inset-0 z-40 min-h-dvh bg-surface-dimmed',
  'transition-opacity duration-150 ease-out',
  'data-ending-style:opacity-0 data-starting-style:opacity-0',
  'motion-reduce:transition-none',
  'supports-[-webkit-touch-callout:none]:absolute',
].join(' ');

const contentClassName = [
  'fixed left-1/2 top-1/2 z-50 flex w-[428px] max-w-[calc(100vw-32px)]',
  '-translate-x-1/2 -translate-y-1/2 flex-col bg-surface-lowest shadow-drop-shadow-01',
  'rounded-l outline-none',
  'transition-[scale,opacity] duration-150 ease-out',
  'data-ending-style:scale-[0.98] data-ending-style:opacity-0',
  'data-starting-style:scale-[0.98] data-starting-style:opacity-0',
  'motion-reduce:transition-none',
].join(' ');

const graphicVariants = cva('shrink-0 rounded-l bg-surface-low', {
  variants: {
    size: {
      default: 'h-[150px] w-[147px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ModalContentProps = Omit<ComponentProps<typeof DialogPrimitive.Popup>, 'className'> & {
  className?: string;
  backdropClassName?: string;
  portalProps?: Omit<DialogPrimitive.Portal.Props, 'children'>;
};

type ModalGraphicProps = ComponentProps<typeof Box<'div'>> & VariantProps<typeof graphicVariants>;

type ModalBodyProps = ComponentProps<typeof Box<'div'>>;

type ModalHeaderProps = ComponentProps<typeof Box<'div'>>;

type ModalActionsProps = ComponentProps<typeof Box<'div'>>;

export type ModalCloseButtonProps = ButtonProps;

export type ModalCloseTextProps = Omit<DialogPrimitive.Close.Props, 'className' | 'render'> & {
  className?: string;
  children: ReactNode;
};

const ModalRoot = (props: ModalRootProps): JSX.Element => {
  return <DialogPrimitive.Root {...props} />;
};

const ModalTrigger = (props: ModalTriggerProps): JSX.Element => {
  return <DialogPrimitive.Trigger {...props} />;
};

const ModalContent = ({
  className,
  backdropClassName: customBackdropClassName,
  portalProps,
  children,
  ...props
}: ModalContentProps): JSX.Element => {
  return (
    <DialogPrimitive.Portal {...portalProps}>
      <DialogPrimitive.Backdrop className={cn(backdropClassName, customBackdropClassName)} />
      <DialogPrimitive.Popup className={cn(contentClassName, className)} {...props}>
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
};

const ModalTitle = ({ className, ...props }: ModalTitleProps): JSX.Element => {
  return (
    <DialogPrimitive.Title
      render={
        <Text
          as="h2"
          variant="heading-xl"
          className={cn('m-0 text-center text-text-high', className)}
        />
      }
      {...props}
    />
  );
};

const ModalDescription = ({ className, ...props }: ModalDescriptionProps): JSX.Element => {
  return (
    <DialogPrimitive.Description
      render={
        <Text
          as="p"
          variant="heading-sm"
          className={cn('m-0 text-center text-text-medium', className)}
        />
      }
      {...props}
    />
  );
};

const ModalGraphic = ({ className, size, ...props }: ModalGraphicProps): JSX.Element => {
  return <Box className={cn(graphicVariants({ size }), className)} {...props} />;
};

const ModalBody = ({ className, ...props }: ModalBodyProps): JSX.Element => {
  return <Box className={cn('flex w-full flex-col items-center', className)} {...props} />;
};

const ModalHeader = ({ className, ...props }: ModalHeaderProps): JSX.Element => {
  return (
    <Box className={cn('flex w-full flex-col items-center text-center', className)} {...props} />
  );
};

const ModalActions = ({ className, ...props }: ModalActionsProps): JSX.Element => {
  return <Box className={cn('flex w-full', className)} {...props} />;
};

const ModalClose = (props: ModalCloseProps): JSX.Element => {
  return <DialogPrimitive.Close {...props} />;
};

const ModalCloseButton = (props: ModalCloseButtonProps): JSX.Element => {
  return <DialogPrimitive.Close render={<Button {...props} />} />;
};

const ModalCloseText = ({ className, children, ...props }: ModalCloseTextProps): JSX.Element => {
  return (
    <DialogPrimitive.Close
      className={cn(
        [
          'inline-flex h-[22px] items-center justify-center self-center px-002',
          'text-text-medium transition-colors hover:not-data-disabled:text-text-high',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        ],
        className,
      )}
      {...props}
    >
      <Text variant="subtitle-xxs">{children}</Text>
    </DialogPrimitive.Close>
  );
};

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Graphic: ModalGraphic,
  Actions: ModalActions,
  Close: ModalClose,
  CloseButton: ModalCloseButton,
  CloseText: ModalCloseText,
};
