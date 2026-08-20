'use client';

import { useRef, type JSX } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import { Text } from '@/shared/ui/text';

const CLAMP_OVERFLOW_THRESHOLD_PX = 1;

type CompareResultChannelDetailValueProps = {
  children: string;
};

function isTextClamped(element: HTMLElement): boolean {
  return element.scrollHeight - element.clientHeight > CLAMP_OVERFLOW_THRESHOLD_PX;
}

export function CompareResultChannelDetailValue({
  children,
}: CompareResultChannelDetailValueProps): JSX.Element {
  const textRef = useRef<HTMLSpanElement>(null);

  return (
    <BaseTooltip.Root
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) {
          return;
        }

        const textElement = textRef.current;
        if (textElement === null || !isTextClamped(textElement)) {
          eventDetails.cancel();
        }
      }}
    >
      <BaseTooltip.Trigger
        closeOnClick={false}
        className="block w-full min-w-0 touch-manipulation bg-transparent p-0 text-left"
      >
        <Text
          as="span"
          ref={textRef}
          variant="subtitle-xxs"
          className="text-text-default line-clamp-3 w-full min-w-0 overflow-hidden break-keep"
        >
          {children}
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
            className="bg-surface-lowest p-012 shadow-drop-shadow-02 max-w-[min(280px,calc(100vw-32px))] rounded-[var(--radius-s)]"
          >
            <Text as="p" variant="caption-lg" className="text-text-default m-0 break-keep">
              {children}
            </Text>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
