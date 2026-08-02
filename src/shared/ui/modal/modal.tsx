'use client';

import type { JSX } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { Button, type ButtonProps } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

type ModalRootProps = DialogPrimitive.Root.Props;
type ModalTriggerProps = DialogPrimitive.Trigger.Props;
type ModalPortalProps = DialogPrimitive.Portal.Props;
type ModalBackdropProps = DialogPrimitive.Backdrop.Props;
type ModalPopupProps = DialogPrimitive.Popup.Props;
type ModalTitleProps = DialogPrimitive.Title.Props;
type ModalDescriptionProps = DialogPrimitive.Description.Props;
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
  'rounded-[var(--radius-l)] outline-none',
  'transition-[scale,opacity] duration-150 ease-out',
  'data-ending-style:scale-[0.9] data-ending-style:opacity-0',
  'data-starting-style:scale-[0.9] data-starting-style:opacity-0',
  'motion-reduce:transition-none',
].join(' ');

export type ModalCloseButtonProps = ButtonProps;

export type ModalCloseTextProps = DialogPrimitive.Close.Props;

const ModalRoot = (props: ModalRootProps): JSX.Element => {
  return <DialogPrimitive.Root {...props} />;
};

const ModalTrigger = (props: ModalTriggerProps): JSX.Element => {
  return <DialogPrimitive.Trigger {...props} />;
};

const ModalPortal = (props: ModalPortalProps): JSX.Element => {
  return <DialogPrimitive.Portal {...props} />;
};

const ModalBackdrop = ({ className, ...props }: ModalBackdropProps): JSX.Element => {
  return (
    <DialogPrimitive.Backdrop
      className={(state) =>
        cn(backdropClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const ModalPopup = ({ className, ...props }: ModalPopupProps): JSX.Element => {
  return (
    <DialogPrimitive.Popup
      className={(state) =>
        cn(contentClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const ModalTitle = ({
  className,
  render = <Text as="h2" variant="heading-xl" />,
  ...props
}: ModalTitleProps): JSX.Element => {
  return (
    <DialogPrimitive.Title
      render={render}
      className={(state) =>
        cn(
          'm-0 text-center text-text-high',
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  );
};

const ModalDescription = ({
  className,
  render = <Text as="p" variant="heading-sm" />,
  ...props
}: ModalDescriptionProps): JSX.Element => {
  return (
    <DialogPrimitive.Description
      render={render}
      className={(state) =>
        cn(
          'm-0 text-center text-text-medium',
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  );
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
      className={(state) =>
        cn(
          [
            'inline-flex h-[22px] items-center justify-center self-center px-002',
            'cursor-pointer text-text-medium transition-colors hover:not-data-disabled:text-text-high',
            'focus-visible:not-data-disabled:text-text-high',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
            'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          ],
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    >
      <Text variant="subtitle-xxs">{children}</Text>
    </DialogPrimitive.Close>
  );
};

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Portal: ModalPortal,
  Backdrop: ModalBackdrop,
  Popup: ModalPopup,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
  CloseButton: ModalCloseButton,
  CloseText: ModalCloseText,
};
