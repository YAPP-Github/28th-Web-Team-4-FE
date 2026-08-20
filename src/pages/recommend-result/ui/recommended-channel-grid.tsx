'use client';

import type { JSX } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import type {
  RecommendedChannel,
  RecommendedChannelMatchBadgeTone,
} from '@/pages/recommend-result/model/recommended-channels';

import { RecommendedChannelCard } from './recommended-channel-card';

type RecommendedChannelGridProps = {
  channels: readonly RecommendedChannel[];
  matchBadgeToneByChannelId: ReadonlyMap<string, RecommendedChannelMatchBadgeTone>;
  startDelay?: number;
  startIndex?: number;
  selectedChannelIds: readonly string[];
  isGuest?: boolean;
  onOpenDetail: (channel: RecommendedChannel) => void;
  onToggleSelection: (channelId: string) => void;
};

const MotionList = motion.ul;
const MotionItem = motion.li;
const CARD_ENTER_EASE = [0.23, 1, 0.32, 1] as const;
const CARD_STAGGER_DELAY = 0.07;
const GUEST_LOCKED_CHANNEL_COUNT = 2;

function isRecommendedChannelLocked(isGuest: boolean, channelIndex: number): boolean {
  return isGuest && channelIndex < GUEST_LOCKED_CHANNEL_COUNT;
}

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
  matchBadgeToneByChannelId,
  startDelay = 0.04,
  startIndex = 0,
  selectedChannelIds,
  isGuest = false,
  onOpenDetail,
  onToggleSelection,
}: RecommendedChannelGridProps): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <ul className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center sm:px-[56px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:px-0">
        {channels.map((channel, index) => {
          const channelIndex = startIndex + index;

          return (
            <li key={channel.id} className="flex w-full justify-center">
              <RecommendedChannelCard
                channel={channel}
                matchBadgeTone={matchBadgeToneByChannelId.get(channel.id) ?? 'gray'}
                selected={selectedChannelIds.includes(channel.id)}
                locked={isRecommendedChannelLocked(isGuest, channelIndex)}
                imageLoading={channelIndex < 4 ? 'eager' : 'lazy'}
                onOpenDetail={onOpenDetail}
                onToggleSelection={onToggleSelection}
              />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <MotionList
      className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center sm:px-[56px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:px-0"
      variants={gridVariants}
      initial="hidden"
      animate="show"
      custom={startDelay + startIndex * CARD_STAGGER_DELAY}
    >
      {channels.map((channel, index) => {
        const channelIndex = startIndex + index;

        return (
          <MotionItem
            key={channel.id}
            variants={cardVariants}
            className="flex w-full justify-center"
          >
            <RecommendedChannelCard
              channel={channel}
              matchBadgeTone={matchBadgeToneByChannelId.get(channel.id) ?? 'gray'}
              selected={selectedChannelIds.includes(channel.id)}
              locked={isRecommendedChannelLocked(isGuest, channelIndex)}
              imageLoading={channelIndex < 4 ? 'eager' : 'lazy'}
              onOpenDetail={onOpenDetail}
              onToggleSelection={onToggleSelection}
            />
          </MotionItem>
        );
      })}
    </MotionList>
  );
}
