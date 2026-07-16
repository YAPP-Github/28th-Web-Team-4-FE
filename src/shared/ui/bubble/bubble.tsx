import type { JSX } from 'react';

import { keys } from '@/shared/lib/object';

import { BotBubble, type BotBubbleProps } from './bot-bubble';
import { UserBubble, type UserBubbleProps } from './user-bubble';

const FRAME_MAP = {
  bot: 'bot',
  user: 'user',
} as const;

export type BubbleFrame = keyof typeof FRAME_MAP;

export const BUBBLE_FRAMES = keys(FRAME_MAP);

export type BubbleProps =
  | (BotBubbleProps & { frame?: 'bot' })
  | (UserBubbleProps & { frame: 'user' });

export const Bubble = (props: BubbleProps): JSX.Element => {
  if (props.frame === 'user') {
    const { frame: _frame, ...userProps } = props;

    return <UserBubble {...userProps} />;
  }

  const { frame: _frame, ...botProps } = props;

  return <BotBubble {...botProps} />;
};
