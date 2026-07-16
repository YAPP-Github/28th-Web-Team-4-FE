import type { JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { Box } from '@/shared/ui/layout/box';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

type BubbleShellFrame = 'bot' | 'user';

export const bubbleShellVariants = cva('px-026 py-022 shadow-drop-shadow-01 w-full', {
  variants: {
    frame: {
      bot: 'bg-surface-lowest rounded-bl-m rounded-br-m rounded-tr-m',
      user: 'bg-surface-high rounded-bl-m rounded-br-m rounded-tl-m',
    },
  },
});

type BubbleShellProps = {
  frame: BubbleShellFrame;
  className?: string;
  children: ReactNode;
};

export const BubbleShell = ({ frame, className, children }: BubbleShellProps): JSX.Element => (
  <Box className={cn(bubbleShellVariants({ frame }), className)}>
    <Text
      variant="subtitle-xl"
      className={cn('break-words', frame === 'bot' ? 'text-text-highest' : 'text-text-lowest')}
    >
      {children}
    </Text>
  </Box>
);
