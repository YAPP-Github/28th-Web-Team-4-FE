import type { JSX, SVGProps } from 'react';

import { cn } from '@/shared/ui/cn';

export type FeedbackIconProps = SVGProps<SVGSVGElement>;

export function WarningErrorIcon({ className, ...props }: FeedbackIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="none"
      className={cn('text-sys-error-default size-012 shrink-0', className)}
      aria-hidden
      {...props}
    >
      <circle cx="6" cy="6" r="6" fill="currentColor" />
      <path
        d="M6 4V6.4M6 8.8H6.006"
        className="stroke-icon-lower"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InfoFillIcon({ className, ...props }: FeedbackIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="none"
      className={cn('text-icon-low size-012 shrink-0', className)}
      aria-hidden
      {...props}
    >
      <circle cx="6" cy="6" r="6" fill="currentColor" />
      <path
        d="M6 8.80078V6.40078M6 4.00078H6.006"
        className="stroke-icon-lower"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
