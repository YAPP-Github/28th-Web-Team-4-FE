import type { ComponentProps, JSX } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';

export type SkeletonProps = ComponentProps<'div'>;

export const Skeleton = ({ className, ...restProps }: SkeletonProps): JSX.Element => {
  return (
    <Box
      {...restProps}
      aria-hidden
      className={cn('bg-surface-default motion-safe:animate-skeleton-pulse', className)}
    />
  );
};
