import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { HStack } from '@/shared/ui/layout/h-stack';

const DEFAULT_ARIA_LABEL = '하단 내비게이션';

export type BottomNavigationProps = Omit<ComponentProps<'nav'>, 'children'> & {
  left?: ReactNode;
  right?: ReactNode;
};

export const BottomNavigation = ({
  left,
  right,
  className,
  'aria-label': ariaLabel = DEFAULT_ARIA_LABEL,
  ...restProps
}: BottomNavigationProps): JSX.Element => {
  return (
    <Center
      as="nav"
      aria-label={ariaLabel}
      className={cn(
        'bg-surface-lowest border-outline-low min-h-072 w-full shrink-0 border-t px-024 py-016',
        className,
      )}
      {...restProps}
    >
      <HStack className="gap-016 w-full max-w-[1200px] justify-between">
        <Box className="flex min-w-0 flex-1 items-center justify-start">{left}</Box>
        <Box className="flex min-w-0 flex-1 items-center justify-end">{right}</Box>
      </HStack>
    </Center>
  );
};
