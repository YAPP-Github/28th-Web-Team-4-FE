import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';

import { SymbolMark } from './symbol-mark';

const DEFAULT_ALT = 'chaesozip';

export type SymbolProps = {
  className?: string;
  /** 접근성 대체 텍스트. 기본 'chaesozip'. 빈 문자열이면 decorative */
  alt?: string;
};

export function Symbol({ className, alt = DEFAULT_ALT }: SymbolProps): JSX.Element {
  const isDecorative = alt === '';

  return (
    <span
      className={cn(
        'text-sys-primary-default inline-flex aspect-[28.1382/32.3791] w-[28px] shrink-0 items-center justify-center',
        className,
      )}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      <SymbolMark className="size-full" />
    </span>
  );
}
