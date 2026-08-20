'use client';

import { useRef, useState, type JSX } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import { Text } from '@/shared/ui/text';

const CLAMP_OVERFLOW_THRESHOLD_PX = 1;

function isTextClamped(element: HTMLElement): boolean {
  return element.scrollHeight - element.clientHeight > CLAMP_OVERFLOW_THRESHOLD_PX;
}

export function ChannelDescriptionTooltip({ description }: { description: string }): JSX.Element {
  const textRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  const isCurrentTextClamped = (): boolean => {
    const textElement = textRef.current;

    return textElement !== null && isTextClamped(textElement);
  };

  return (
    <BaseTooltip.Root
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (nextOpen && !isCurrentTextClamped()) {
          eventDetails.cancel();
          return;
        }

        setOpen(nextOpen);
      }}
    >
      <BaseTooltip.Trigger
        render={<span />}
        closeOnClick={false}
        onClick={(event) => {
          if (!isCurrentTextClamped()) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          setOpen((currentOpen) => !currentOpen);
        }}
        className="block w-full min-w-0 touch-manipulation bg-transparent p-0 text-left"
      >
        <Text
          as="span"
          ref={textRef}
          variant="body-lg"
          className="text-text-medium line-clamp-2 w-full min-w-0 overflow-hidden break-keep"
        >
          {description}
        </Text>
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side="bottom"
          align="center"
          sideOffset={8}
          collisionPadding={8}
          positionMethod="fixed"
          className="z-50"
        >
          <BaseTooltip.Popup
            role="tooltip"
            className="bg-surface-lowest p-012 shadow-drop-shadow-02 max-w-[min(310px,calc(100vw-32px))] rounded-[var(--radius-s)]"
          >
            <Text as="p" variant="caption-lg" className="text-text-default m-0 break-keep">
              {description}
            </Text>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
