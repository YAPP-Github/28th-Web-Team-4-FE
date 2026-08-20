import type { JSX } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/ui/cn';

import { SymbolMark, type SymbolType } from './symbol-mark';

const DEFAULT_ALT = 'chaesozip';

export type SymbolProps = {
  className?: string;
  type?: SymbolType;
  /** 접근성 대체 텍스트. 기본 'chaesozip'. 빈 문자열이면 decorative */
  alt?: string;
};

const symbolVariants = cva('relative inline-flex size-[44px] shrink-0 overflow-clip', {
  variants: {
    type: {
      favicon: '',
      symbol: 'rounded-xs',
      'symbol-login': '',
    },
  },
  defaultVariants: {
    type: 'symbol',
  },
});

const markVariants = cva('absolute', {
  variants: {
    type: {
      favicon:
        'left-[calc(50%+0.5px)] top-[calc(50%-0.25px)] h-[33.5px] w-[39px] -translate-x-1/2 -translate-y-1/2',
      symbol: 'inset-0 size-full',
      'symbol-login':
        'left-1/2 top-[calc(50%-0.26px)] h-[27.487px] w-[32px] -translate-x-1/2 -translate-y-1/2',
    },
  },
  defaultVariants: {
    type: 'symbol',
  },
});

export function BrandSymbol({
  className,
  type = 'symbol',
  alt = DEFAULT_ALT,
}: SymbolProps): JSX.Element {
  const isDecorative = alt === '';

  return (
    <span
      className={cn(symbolVariants({ type }), className)}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      <SymbolMark type={type} className={markVariants({ type })} />
    </span>
  );
}
