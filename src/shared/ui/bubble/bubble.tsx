import type { JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { Box } from '@/shared/ui/layout/box';
import { VStack } from '@/shared/ui/layout/v-stack';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

const DEFAULT_EDIT_LABEL = '수정';

const bubbleVariants = cva('px-026 py-022 shadow-drop-shadow-01 w-full', {
  variants: {
    type: {
      bot: 'bg-surface-lowest rounded-bl-m rounded-br-m rounded-tr-m',
      user: 'bg-surface-high rounded-bl-m rounded-br-m rounded-tl-m',
    },
  },
  defaultVariants: {
    type: 'bot',
  },
});

type BubbleBaseProps = {
  children: ReactNode;
  className?: string;
};

export type BubbleProps =
  | (BubbleBaseProps & { type?: 'bot' })
  | (BubbleBaseProps & {
      type: 'user';
      canEdit?: boolean;
      onEdit?: () => void;
      editLabel?: string;
    });

const BubbleContent = ({
  type,
  children,
}: {
  type: 'bot' | 'user';
  children: ReactNode;
}): JSX.Element => (
  <Text
    variant="subtitle-xl"
    className={cn('break-words', type === 'bot' ? 'text-text-highest' : 'text-text-lowest')}
  >
    {children}
  </Text>
);

export const Bubble = (props: BubbleProps): JSX.Element => {
  const { children, className } = props;

  if (props.type === 'user') {
    const { canEdit = false, onEdit, editLabel = DEFAULT_EDIT_LABEL } = props;

    return (
      <VStack className={cn('gap-006', className)}>
        <Box className={bubbleVariants({ type: 'user' })}>
          <BubbleContent type="user">{children}</BubbleContent>
        </Box>
        {canEdit && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="w-full text-right underline decoration-from-font"
          >
            <Text variant="subtitle-xxs" className="text-text-medium">
              {editLabel}
            </Text>
          </button>
        )}
      </VStack>
    );
  }

  return (
    <Box className={cn(bubbleVariants({ type: 'bot' }), className)}>
      <BubbleContent type="bot">{children}</BubbleContent>
    </Box>
  );
};
