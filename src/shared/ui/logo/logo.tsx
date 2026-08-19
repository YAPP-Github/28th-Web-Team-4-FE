import type { JSX } from 'react';
import { cva } from 'class-variance-authority';

import { keys } from '@/shared/lib/object';
import { cn } from '@/shared/ui/cn';

import { LogoMark, type LogoMarkType } from './logo-mark';

const TYPE_MAP = {
  s: 's',
  m: 'm',
  l: 'l',
} as const;

export type LogoType = LogoMarkType;

export const LOGO_TYPES = keys(TYPE_MAP);

const DEFAULT_ALT = 'chaesozip';

export type LogoProps = {
  type?: LogoType;
  className?: string;
  /** 접근성 대체 텍스트. 기본 'chaesozip'. 빈 문자열이면 decorative */
  alt?: string;
};

/** Figma 프레임 비율 — width만 바뀌어도 패딩 포함해 함께 스케일 */
const logoVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-text-primary h-auto',
  {
    variants: {
      type: {
        s: 'aspect-[110/30] w-[110px]',
        m: 'aspect-[136/36] w-[136px]',
        l: 'aspect-[440/149] w-[440px]',
      },
    },
    defaultVariants: {
      type: 'm',
    },
  },
);

/** 프레임 대비 그래픽 폭 비율 (Figma: s 104/110, m 130/136) */
const markVariants = cva('h-auto max-w-none', {
  variants: {
    type: {
      s: 'w-[calc(104/110*100%)]',
      m: 'w-[calc(130/136*100%)]',
      l: 'w-[calc(308/440*100%)]',
    },
  },
  defaultVariants: {
    type: 'm',
  },
});

export const Logo = ({ type = 'm', className, alt = DEFAULT_ALT }: LogoProps): JSX.Element => {
  const isDecorative = alt === '';

  return (
    <span
      className={cn(logoVariants({ type }), className)}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      <LogoMark type={type} className={markVariants({ type })} />
    </span>
  );
};
