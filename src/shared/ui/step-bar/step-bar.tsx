'use client';

import type { CSSProperties } from 'react';
import { Progress } from '@base-ui/react/progress';
import { motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Text } from '@/shared/ui/text';

export type StepBarProps = {
  currentStep: number;
  totalSteps: number;
  labels: readonly number[];
  showLabel?: boolean;
  ariaLabel?: string;
  className?: string;
};

const MotionHStack = motion.create(HStack);

type StepBarTrackMotionStyle = {
  '--step-progress': number;
};

type StepBarSegmentStyle = CSSProperties & {
  '--step-index': number;
};

function assertStepBarConfig(totalSteps: number, labels: readonly number[]): void {
  if (!Number.isInteger(totalSteps) || totalSteps < 1) {
    throw new Error('StepBar totalSteps must be an integer greater than or equal to 1.');
  }

  if (labels.length !== totalSteps + 1) {
    throw new Error('StepBar labels length must equal totalSteps + 1.');
  }

  if (!labels.every(Number.isFinite)) {
    throw new Error('StepBar labels must contain only finite numbers.');
  }
}

function normalizeStep(currentStep: number, totalSteps: number): number {
  if (!Number.isFinite(currentStep)) {
    return 0;
  }

  return Math.min(totalSteps, Math.max(0, Math.trunc(currentStep)));
}

function StepBarSegment({ index, isActive }: { index: number; isActive: boolean }) {
  return (
    <Box
      data-active={isActive ? 'true' : 'false'}
      className="bg-sys-empty h-006 min-w-0 flex-1 overflow-hidden rounded-[var(--radius-max)]"
    >
      <Box
        className="bg-sys-primary-default h-full w-full origin-left scale-x-[clamp(0,calc(var(--step-progress)-var(--step-index)),1)] will-change-transform"
        style={{ '--step-index': index } satisfies StepBarSegmentStyle}
      />
    </Box>
  );
}

export function StepBar({
  currentStep,
  totalSteps,
  labels,
  showLabel = true,
  ariaLabel = '진행률',
  className,
}: StepBarProps) {
  assertStepBarConfig(totalSteps, labels);

  const normalizedStep = normalizeStep(currentStep, totalSteps);
  const currentLabel = labels[normalizedStep];
  const ariaValueText = `${currentLabel}%`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <Progress.Root
      render={<HStack className={cn('gap-014 w-full', className)} />}
      value={normalizedStep}
      min={0}
      max={totalSteps}
      aria-label={ariaLabel}
      aria-valuetext={ariaValueText}
    >
      <MotionHStack
        className="gap-010 min-w-0 flex-1"
        aria-hidden
        initial={false}
        animate={{ '--step-progress': normalizedStep } satisfies StepBarTrackMotionStyle}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: 'spring',
                duration: 0.7,
                bounce: 0,
              }
        }
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = index < normalizedStep;

          return <StepBarSegment key={index} index={index} isActive={isActive} />;
        })}
      </MotionHStack>

      {showLabel ? (
        <Text
          variant="heading-lg"
          className={cn('shrink-0', normalizedStep > 0 ? 'text-text-primary' : 'text-text-low')}
        >
          <NumberFlow value={currentLabel} suffix="%" trend={0} animated={!shouldReduceMotion} />
        </Text>
      ) : null}
    </Progress.Root>
  );
}
