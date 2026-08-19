'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { cn } from '@/shared/ui/cn';

import type { PageHeaderAppearance } from './page-header-appearance';

export type PageHeaderNavLinkProps = Omit<ComponentProps<typeof Link>, 'children' | 'href'> & {
  segment: string;
  href: string;
  children: ReactNode;
  variant?: 'desktop' | 'sidebar';
  appearance?: PageHeaderAppearance;
};

function getDesktopTextClassName(appearance: PageHeaderAppearance, isActive: boolean): string {
  if (appearance !== 'default') {
    return 'text-white hover:bg-white/10 hover:text-white/80 focus-visible:bg-white/10 focus-visible:text-white';
  }

  return isActive ? 'text-text-highest' : 'text-text-low';
}

export function PageHeaderNavLink({
  segment,
  href,
  children,
  className,
  variant = 'desktop',
  appearance = 'default',
  ...props
}: PageHeaderNavLinkProps): JSX.Element {
  const selectedSegment = useSelectedLayoutSegment();
  const isActive = segment === selectedSegment;

  return (
    <Link
      {...props}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        variant === 'desktop'
          ? 'typo-subtitle-sm hover:text-text-highest hover:bg-surface-low focus-visible:text-text-highest focus-visible:bg-surface-low flex h-036 shrink-0 items-center justify-center rounded-[var(--radius-xs)] py-008 whitespace-nowrap motion-safe:transition-[scale,background-color,color] motion-safe:duration-100 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:active:scale-[0.97]'
          : 'typo-subtitle-lg text-text-highest focus-visible:outline-sys-primary-default flex h-022 w-fit shrink-0 items-center rounded-[var(--radius-xxs)] whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
        variant === 'desktop' && getDesktopTextClassName(appearance, isActive),
        className,
      )}
    >
      {children}
    </Link>
  );
}
