import type { ComponentProps, JSX } from 'react';

import { cn } from '@/shared/ui/cn';

export type FormPanelProps = ComponentProps<'section'>;

export function FormPanel({ className, children, ...props }: FormPanelProps): JSX.Element {
  return (
    <section
      className={cn(
        'bg-surface-lowest shadow-drop-shadow-01 p-032 sm:p-072 flex w-full max-w-[584px] flex-col items-center rounded-[var(--radius-l)]',
        className,
      )}
      {...props}
    >
      <div className="gap-036 flex w-full max-w-[440px] flex-col items-center">{children}</div>
    </section>
  );
}
