'use client';

import type { ComponentProps, JSX, ReactNode } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { cn } from '@/shared/ui/cn';

export type PageHeaderNavLinkProps = Omit<ComponentProps<typeof Link>, 'children' | 'href'> & {
  segment: string;
  href: string;
  children: ReactNode;
  variant?: 'desktop' | 'sidebar';
};

export function PageHeaderNavLink({
  segment,
  href,
  children,
  className,
  variant = 'desktop',
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
        variant === 'desktop' && (isActive ? 'text-text-highest' : 'text-text-low'),
        className,
      )}
    >
      {children}
    </Link>
  );
}
