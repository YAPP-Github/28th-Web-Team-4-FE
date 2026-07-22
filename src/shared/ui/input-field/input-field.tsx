'use client';

import type { JSX, ReactNode } from 'react';
import { Field as BaseField } from '@base-ui/react/field';

import { cn } from '@/shared/ui/cn';
import { Input, type InputProps } from '@/shared/ui/input';

import { FieldFeedback, type FieldFeedbackTone } from './field-feedback';

type WithoutError<T> = T extends unknown ? Omit<T, 'error'> : never;
type FeedbackInputProps = Exclude<InputProps, { frame: 'filter' }>;

export type InputFieldFeedback = {
  tone: FieldFeedbackTone;
  message: ReactNode;
};

export type InputFieldProps = WithoutError<FeedbackInputProps> &
  Partial<{
    feedback: InputFieldFeedback;
    fieldClassName: string;
  }>;

export function InputField({
  feedback,
  fieldClassName,
  ...inputProps
}: InputFieldProps): JSX.Element {
  const isInvalid = feedback?.tone === 'error';

  return (
    <BaseField.Root
      className={cn('gap-008 flex w-full flex-col items-start', fieldClassName)}
      invalid={isInvalid}
    >
      <Input {...inputProps} error={isInvalid || undefined} />
      {feedback ? <FieldFeedback tone={feedback.tone}>{feedback.message}</FieldFeedback> : null}
    </BaseField.Root>
  );
}
