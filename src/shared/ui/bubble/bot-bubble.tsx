import type { JSX, ReactNode } from 'react';

import { BubbleShell } from './bubble-shell';

export type BotBubbleProps = {
  children: ReactNode;
  className?: string;
};

export const BotBubble = ({ children, className }: BotBubbleProps): JSX.Element => (
  <BubbleShell frame="bot" className={className}>
    {children}
  </BubbleShell>
);
