import Image from 'next/image';
import type { JSX } from 'react';

import { cn } from '@/shared/ui/cn';

export type LogoMarkType = 's' | 'm' | 'l';

const LOGO_ASSETS: Record<LogoMarkType, { height: number; src: string; width: number }> = {
  s: { src: '/brand-assets/logo-s.svg', width: 104, height: 20.8074 },
  m: { src: '/brand-assets/logo-m.svg', width: 130, height: 26.0094 },
  l: { src: '/brand-assets/logo-m.svg', width: 130, height: 26.0094 },
};

export type LogoMarkProps = {
  className?: string;
  type?: LogoMarkType;
};

export function LogoMark({ className, type = 'm' }: LogoMarkProps): JSX.Element {
  const asset = LOGO_ASSETS[type];

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
