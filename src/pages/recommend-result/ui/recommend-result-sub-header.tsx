'use client';

import type { JSX } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

const MotionBox = motion.create(Box);
const TEXT_ENTER_EASE = [0.23, 1, 0.32, 1] as const;

const textVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.22,
      ease: TEXT_ENTER_EASE,
    },
  }),
};

export function RecommendResultSubHeader(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <Box className="gap-008 flex w-full flex-col">
        <Text as="h1" variant="heading-xl" className="text-text-highest break-keep">
          채소집에 딱 맞는 채널이에요
        </Text>
        <Text as="p" variant="body-lg" className="text-text-medium break-keep">
          입력한 광고 목적과 예산을 바탕으로 효율이 높은 채널을 추천했어요
        </Text>
      </Box>
    );
  }

  return (
    <Box className="gap-008 flex w-full flex-col">
      <MotionBox custom={0} variants={textVariants} initial="hidden" animate="show">
        <Text as="h1" variant="heading-xl" className="text-text-highest break-keep">
          채소집에 딱 맞는 채널이에요
        </Text>
      </MotionBox>
      <MotionBox custom={0.06} variants={textVariants} initial="hidden" animate="show">
        <Text as="p" variant="body-lg" className="text-text-medium break-keep">
          입력한 광고 목적과 예산을 바탕으로 효율이 높은 채널을 추천했어요
        </Text>
      </MotionBox>
    </Box>
  );
}
