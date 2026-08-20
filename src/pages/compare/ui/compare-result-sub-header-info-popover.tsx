'use client';

import type { JSX } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Info } from 'lucide-react';

const COMPARISON_BASIS_DESCRIPTION =
  '수치는 업종(쇼핑 · 커머스) 평균 기준이며 실제 성과는 소재 · 예산에 따라 달라질 수 있습니다.';

export function CompareResultSubHeaderInfoPopover(): JSX.Element {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="비교 수치 기준 안내"
        openOnHover
        delay={150}
        closeDelay={100}
        className="text-icon-low hover:text-icon-high focus-visible:outline-sys-primary-default size-018 relative inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full before:absolute before:-inset-[13px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Info aria-hidden="true" className="size-018" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          positionMethod="fixed"
          className="z-30"
        >
          <Popover.Popup
            aria-label="비교 수치 기준 안내"
            initialFocus={false}
            className="bg-surface-lowest p-016 shadow-drop-shadow-02 w-[294px] max-w-[calc(100vw-32px)] rounded-tr-[var(--radius-m)] rounded-br-[var(--radius-m)] rounded-bl-[var(--radius-m)]"
          >
            <Popover.Description className="typo-body-xs text-text-medium m-0 w-full text-pretty">
              {COMPARISON_BASIS_DESCRIPTION}
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
