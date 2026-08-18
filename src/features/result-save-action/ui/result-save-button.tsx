'use client';

import type { JSX } from 'react';
import { Check, Download, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { values } from '@/shared/lib/object';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';

const RESULT_SAVE_BUTTON_LABEL = {
  idle: '결과 저장하기',
  pending: '저장 중',
  saved: '저장 완료',
} as const;
const RESULT_SAVE_BUTTON_STATUS = {
  idle: {
    label: RESULT_SAVE_BUTTON_LABEL.idle,
    icon: <Download aria-hidden="true" className="text-icon-high size-016" />,
  },
  pending: {
    label: RESULT_SAVE_BUTTON_LABEL.pending,
    icon: (
      <LoaderCircle
        aria-hidden="true"
        className="text-icon-high size-016 animate-spin motion-reduce:animate-none"
      />
    ),
  },
  saved: {
    label: RESULT_SAVE_BUTTON_LABEL.saved,
    icon: <Check aria-hidden="true" className="text-icon-high size-016" strokeWidth={2.4} />,
  },
} as const;
const STATUS_CONTENT_TRANSITION = {
  type: 'spring',
  duration: 0.24,
  bounce: 0,
} as const;

export type ResultSaveButtonStatus = keyof typeof RESULT_SAVE_BUTTON_LABEL;

type ResultSaveButtonProps = {
  describedBy?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  status: ResultSaveButtonStatus;
};

function ResultSaveButtonContent({ status }: { status: ResultSaveButtonStatus }): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const yOffset = shouldReduceMotion ? 0 : 18;

  return (
    <span aria-hidden="true" className="relative inline-grid overflow-hidden text-center">
      {values(RESULT_SAVE_BUTTON_STATUS).map(({ icon, label }) => (
        <span
          key={label}
          className="gap-008 px-002 invisible col-start-1 row-start-1 inline-flex items-center justify-center"
        >
          <span className="size-016 inline-flex shrink-0 items-center justify-center">{icon}</span>
          <span>{label}</span>
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="gap-008 px-002 col-start-1 row-start-1 inline-flex items-center justify-center will-change-transform"
          initial={{ opacity: 0, y: -yOffset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: yOffset }}
          transition={STATUS_CONTENT_TRANSITION}
        >
          <span className="size-016 inline-flex shrink-0 items-center justify-center">
            {RESULT_SAVE_BUTTON_STATUS[status].icon}
          </span>
          <span>{RESULT_SAVE_BUTTON_STATUS[status].label}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function ResultSaveButton({
  describedBy,
  disabled,
  className,
  onClick,
  status,
}: ResultSaveButtonProps): JSX.Element {
  const label = RESULT_SAVE_BUTTON_STATUS[status].label;

  return (
    <Button
      frame="button"
      tone="stroke"
      type="button"
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className={cn('border-outline-low h-044 px-020 py-010', className)}
      onClick={onClick}
    >
      <ResultSaveButtonContent status={status} />
    </Button>
  );
}
