import type { JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Center } from '@/shared/ui/layout/center';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

const DEFAULT_GRAPHIC_SRC = '/placeholder-g-search.svg';

export type PlaceholderProps = {
  title: ReactNode;
  subtitle: ReactNode;
  graphic?: ReactNode;
  className?: string;
};

const DefaultGraphic = (): JSX.Element => (
  <Box
    aria-hidden
    className="block size-full bg-contain bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${DEFAULT_GRAPHIC_SRC})` }}
  />
);

export const Placeholder = ({
  title,
  subtitle,
  graphic,
  className,
}: PlaceholderProps): JSX.Element => {
  return (
    <Stack className={cn('items-center gap-016 text-center', className)}>
      <Center className="size-120 shrink-0">{graphic ?? <DefaultGraphic />}</Center>
      <Stack className="gap-004 w-full items-center whitespace-nowrap">
        <Text as="p" variant="heading-lg" className="text-text-default">
          {title}
        </Text>
        <Text as="p" variant="body-xl" className="text-text-medium">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  );
};
