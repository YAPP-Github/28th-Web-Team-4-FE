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

const TONE_MAP = {
  brand: 'brand',
  inverse: 'inverse',
  muted: 'muted',
} as const;

export type LogoType = LogoMarkType;
export type LogoTone = keyof typeof TONE_MAP;

export const LOGO_TYPES = keys(TYPE_MAP);
export const LOGO_TONES = keys(TONE_MAP);

const DEFAULT_ALT = 'chaesozip';

export type LogoProps = {
  type?: LogoType;
  tone?: LogoTone;
  className?: string;
  /** 접근성 대체 텍스트. 기본 'chaesozip'. 빈 문자열이면 decorative */
  alt?: string;
};

/** Figma 프레임 비율 — width만 바뀌어도 패딩 포함해 함께 스케일 */
const logoVariants = cva('inline-flex h-auto shrink-0 items-center justify-center', {
  variants: {
    type: {
      s: 'aspect-[110/30] w-[110px]',
      m: 'aspect-[136/36] w-[136px]',
      l: 'aspect-[440/149] w-[440px]',
    },
    tone: {
      brand: 'text-text-primary',
      inverse: 'text-icon-lower',
      muted: 'text-icon-default',
    },
  },
  defaultVariants: {
    type: 'm',
    tone: 'brand',
  },
});

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

export const Logo = ({
  type = 'm',
  tone = 'brand',
  className,
  alt = DEFAULT_ALT,
}: LogoProps): JSX.Element => {
  const isDecorative = alt === '';

  return (
    <span
      className={cn(logoVariants({ type, tone }), className)}
      {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
    >
      <LogoMark type={type} className={markVariants({ type })} />
    </span>
  );
};
