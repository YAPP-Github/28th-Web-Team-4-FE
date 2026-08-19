import Image from 'next/image';
import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';

export const SYMBOL_TYPES = ['favicon', 'symbol', 'symbol-login'] as const;

export type SymbolType = (typeof SYMBOL_TYPES)[number];

const SYMBOL_ASSETS: Record<SymbolType, { height: number; src: string; width: number }> = {
  favicon: { src: '/brand-assets/symbol-favicon.svg', width: 39, height: 33.4996 },
  symbol: { src: '/brand-assets/symbol.png', width: 44, height: 44 },
  'symbol-login': { src: '/brand-assets/symbol-login.svg', width: 32, height: 27.4868 },
};

export type SymbolMarkProps = {
  className?: string;
  type?: SymbolType;
};

export function SymbolMark({ className, type = 'symbol' }: SymbolMarkProps): JSX.Element {
  const asset = SYMBOL_ASSETS[type];

  return (
    <Image
      src={asset.src}
      alt=""
      width={asset.width}
      height={asset.height}
      className={cn('block max-w-none', className)}
    />
  );
}
