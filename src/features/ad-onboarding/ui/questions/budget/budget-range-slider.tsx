'use client';

/**
 * 최소·최대 예산을 균등한 5개 위치에 매핑하는 Base UI Range Slider다.
 */

import { useState, type JSX } from 'react';
import { Slider } from '@base-ui/react/slider';

import {
  BUDGET_SLIDER_MAX,
  BUDGET_SLIDER_MIN,
  getBudgetAmountByStepIndex,
  getBudgetRangeByStepIndexList,
  getBudgetSliderValue,
  getKeyboardBudgetSliderValue,
  snapBudgetSliderStepIndex,
  snapBudgetSliderValue,
  toBudgetSliderValue,
  type BudgetSliderValue,
} from '@/features/ad-onboarding/lib/budget-slider';
import { BUDGET_STEP_LIST, formatBudgetAmount } from '@/features/ad-onboarding/lib/budget-snap';
import type { BudgetRange } from '@/features/ad-onboarding/model/common-onboarding-options';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

const DRAG_STEP_INTERVAL = 0.1;
const BUDGET_THUMB_CLASS_NAME = [
  'bg-surface-lowest border-outline-default shadow-drop-shadow-01',
  'size-022 rounded-[var(--radius-max)] border',
  'transition-[inset-inline-start,transform] duration-150 ease-in-out',
  'motion-reduce:transition-none',
  'has-[:focus-visible]:border-sys-primary-default',
].join(' ');
const BUDGET_STEP_LABEL_POSITION_CLASS_NAME_LIST = [
  'left-0',
  'left-[calc(25%+5.5px)] -translate-x-1/2',
  'left-1/2 -translate-x-1/2',
  'left-[calc(75%-5.5px)] -translate-x-1/2',
  'right-0',
] as const satisfies readonly string[];

export type BudgetRangeSliderProps = {
  range: BudgetRange;
  onRangePreviewChange: (range: BudgetRange) => void;
  onRangeChange: (range: BudgetRange) => void;
};

/**
 * 드래그 중에는 연속 위치를 표시하고 조작이 끝나면 5개 예산 단계로 보정하는 Range Slider다.
 */
export function BudgetRangeSlider({
  range,
  onRangePreviewChange,
  onRangeChange,
}: BudgetRangeSliderProps): JSX.Element {
  const [dragValue, setDragValue] = useState<BudgetSliderValue | null>(null);
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const sliderValue = dragValue ?? getBudgetSliderValue(range);

  return (
    <div className="bg-surface-lowest shadow-drop-shadow-01 w-full rounded-[var(--radius-l)]">
      <Slider.Root
        min={BUDGET_SLIDER_MIN}
        max={BUDGET_SLIDER_MAX}
        step={DRAG_STEP_INTERVAL}
        largeStep={1}
        minStepsBetweenValues={0}
        thumbCollisionBehavior="none"
        value={sliderValue}
        onValueChange={(stepIndexList, eventDetails) => {
          if (eventDetails.reason === 'keyboard') {
            const { activeThumbIndex } = eventDetails;

            if (activeThumbIndex !== 0 && activeThumbIndex !== 1) {
              return;
            }

            setIsPointerDragging(false);
            const nextSliderValue = getKeyboardBudgetSliderValue(
              sliderValue,
              stepIndexList,
              activeThumbIndex,
              eventDetails.event.key,
            );

            onRangeChange(getBudgetRangeByStepIndexList(nextSliderValue));
            return;
          }

          const nextSliderValue = toBudgetSliderValue(stepIndexList);

          setIsPointerDragging(eventDetails.reason === 'drag');
          setDragValue(nextSliderValue);
          onRangePreviewChange(
            getBudgetRangeByStepIndexList(snapBudgetSliderValue(nextSliderValue)),
          );
        }}
        onValueCommitted={(stepIndexList, eventDetails) => {
          if (eventDetails.reason === 'keyboard') {
            return;
          }

          const nextSliderValue = snapBudgetSliderValue(stepIndexList);

          setIsPointerDragging(false);
          onRangeChange(getBudgetRangeByStepIndexList(nextSliderValue));
          setDragValue(null);
        }}
      >
        <Slider.Control className="h-022 mx-[11px] flex w-[calc(100%-22px)] touch-none items-center select-none">
          <Slider.Track className="bg-outline-default h-006 relative w-full rounded-[var(--radius-max)]">
            <Slider.Indicator
              className={cn(
                'bg-sys-primary-default h-full rounded-[var(--radius-max)]',
                'transition-[inset-inline-start,width] duration-150 ease-in-out',
                'motion-reduce:transition-none',
                isPointerDragging && 'transition-none',
              )}
            />
            <Slider.Thumb
              index={0}
              aria-label="최소 예산 슬라이더"
              aria-valuetext={formatBudgetAmount(
                getBudgetAmountByStepIndex(snapBudgetSliderStepIndex(sliderValue[0])),
              )}
              className={cn(BUDGET_THUMB_CLASS_NAME, isPointerDragging && 'transition-none')}
            />
            <Slider.Thumb
              index={1}
              aria-label="최대 예산 슬라이더"
              aria-valuetext={formatBudgetAmount(
                getBudgetAmountByStepIndex(snapBudgetSliderStepIndex(sliderValue[1])),
              )}
              className={cn(BUDGET_THUMB_CLASS_NAME, isPointerDragging && 'transition-none')}
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      <div className="h-018 relative mt-[9px]" aria-hidden>
        {BUDGET_STEP_LIST.map((step, index) => (
          <Text
            key={step.amount}
            variant="body-xs"
            className={cn(
              'text-text-low absolute top-0 whitespace-nowrap',
              BUDGET_STEP_LABEL_POSITION_CLASS_NAME_LIST[index],
            )}
          >
            {formatBudgetAmount(step.amount)}
          </Text>
        ))}
      </div>
    </div>
  );
}
