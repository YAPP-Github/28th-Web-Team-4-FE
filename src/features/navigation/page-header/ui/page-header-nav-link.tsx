'use client';

import type { JSX, ReactNode } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { cn } from '@/shared/ui/cn';

export type PageHeaderNavLinkProps = {
  segment: string;
  href?: string;
  children: ReactNode;
};

export function PageHeaderNavLink({
  segment,
  href,
  children,
}: PageHeaderNavLinkProps): JSX.Element {
  const selectedSegment = useSelectedLayoutSegment();
  const isActive = segment === selectedSegment;
  const linkHref = href ?? `/${segment}`;

  return (
    <Link
      href={linkHref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'typo-subtitle-sm hover:text-text-highest hover:bg-surface-low focus-visible:text-text-highest focus-visible:bg-surface-low flex h-036 shrink-0 items-center justify-center rounded-[var(--radius-xs)] px-012 py-008 whitespace-nowrap motion-safe:transition-[scale,background-color,color] motion-safe:duration-100 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:active:scale-[0.97]',
        isActive ? 'text-text-highest' : 'text-text-low',
      )}
    >
      {children}
    </Link>
  );
}
