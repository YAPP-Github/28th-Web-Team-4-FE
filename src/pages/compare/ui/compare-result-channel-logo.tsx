import type { JSX } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/ui/cn';

type CompareResultChannelLogoProps = {
  name: string;
  logoSrc: string | null;
  cropIcon?: boolean;
  size: 'small' | 'large';
};

const LOGO_SIZE_CLASS = {
  small: 'size-024',
  large: 'size-040',
} as const;

export function CompareResultChannelLogo({
  name,
  logoSrc,
  cropIcon = false,
  size,
}: CompareResultChannelLogoProps): JSX.Element {
  const sizeClassName = LOGO_SIZE_CLASS[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-surface-low text-text-medium inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-xs)]',
        sizeClassName,
      )}
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt=""
          width={size === 'small' ? 24 : 40}
          height={size === 'small' ? 24 : 40}
          className={cn('size-full object-cover', cropIcon && 'scale-[1.42]')}
        />
      ) : (
        <span className={cn(size === 'small' ? 'typo-caption-lg' : 'typo-subtitle-md')}>
          {name.trim().charAt(0)}
        </span>
      )}
    </span>
  );
}
