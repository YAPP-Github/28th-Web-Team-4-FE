'use client';

import type { JSX, ReactNode } from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { Check, CircleAlert } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';

const feedbackVariants = cva('typo-body-sm gap-006 pr-012 flex w-full items-center pl-[2px]', {
  variants: {
    tone: {
      error: 'text-sys-error-default',
      success: 'text-sys-success-default',
    },
  },
});

export type FieldFeedbackTone = 'error' | 'success';

export type FieldFeedbackProps = {
  tone: FieldFeedbackTone;
  children: ReactNode;
  className?: string;
};

function FeedbackIcon({ tone }: { tone: FieldFeedbackTone }): JSX.Element {
  if (tone === 'error') {
    return <CircleAlert className="size-012 shrink-0" aria-hidden />;
  }

  return (
    <span
      className="bg-sys-success-default text-text-lowest size-012 flex shrink-0 items-center justify-center rounded-full"
      aria-hidden
    >
      <Check className="size-010" strokeWidth={3} />
    </span>
  );
}

export function FieldFeedback({ tone, children, className }: FieldFeedbackProps): JSX.Element {
  const content = (
    <>
      <FeedbackIcon tone={tone} />
      <span>{children}</span>
    </>
  );
  const feedbackClassName = cn(feedbackVariants({ tone }), className);

  if (tone === 'error') {
    return (
      <BaseField.Error match className={feedbackClassName} role="alert">
        {content}
      </BaseField.Error>
    );
  }

  return (
    <BaseField.Description className={feedbackClassName} role="status">
      {content}
    </BaseField.Description>
  );
}
