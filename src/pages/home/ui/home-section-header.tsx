import type { JSX, ReactNode } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

export type HomeSectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
}: HomeSectionHeaderProps): JSX.Element {
  return (
    <Stack className="gap-012 items-start">
      <Text as="p" variant="heading-md" className="text-text-primary">
        {eyebrow}
      </Text>
      <Box as="h2" className="typo-display-xl text-text-highest max-w-[660px] text-balance">
        {title}
      </Box>
      <Text as="p" variant="subtitle-xl" className="text-text-medium max-w-[560px]">
        {description}
      </Text>
    </Stack>
  );
}
