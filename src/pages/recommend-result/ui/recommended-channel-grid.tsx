'use client';

import type { JSX } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';

import { RecommendedChannelCard } from './recommended-channel-card';

type RecommendedChannelGridProps = {
  channels: readonly RecommendedChannel[];
  startDelay?: number;
};

const MotionList = motion.ul;
const MotionItem = motion.li;
const CARD_ENTER_EASE = [0.23, 1, 0.32, 1] as const;

const gridVariants = {
  hidden: {},
  show: (startDelay: number) => ({
    transition: {
      staggerChildren: 0.07,
      delayChildren: startDelay,
    },
  }),
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: CARD_ENTER_EASE,
    },
  },
};

export function RecommendedChannelGrid({
  channels,
  startDelay = 0.04,
}: RecommendedChannelGridProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <ul className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center md:grid-cols-2 xl:grid-cols-4">
        {channels.map((channel) => (
          <li key={channel.id} className="flex w-full justify-center">
            <RecommendedChannelCard channel={channel} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <MotionList
      className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center md:grid-cols-2 xl:grid-cols-4"
      variants={gridVariants}
      initial="hidden"
      animate="show"
      custom={startDelay}
    >
      {channels.map((channel) => (
        <MotionItem key={channel.id} variants={cardVariants} className="flex w-full justify-center">
          <RecommendedChannelCard channel={channel} />
        </MotionItem>
      ))}
    </MotionList>
  );
}
