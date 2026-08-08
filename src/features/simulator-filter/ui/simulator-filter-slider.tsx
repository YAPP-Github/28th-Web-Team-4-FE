'use client';

import { useState, type JSX } from 'react';
import { Slider } from '@base-ui/react/slider';

import { cn } from '@/shared/ui/cn';

export type SimulatorFilterSliderProps = {
  compact?: boolean;
  disabled?: boolean;
  label: string;
  max: number;
  min: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  step?: number;
  value: number;
  valueText: string;
};

export function SimulatorFilterSlider({
  compact = false,
  disabled = false,
  label,
  max,
  min,
  onValueChange,
  onValueCommitted,
  step = 1,
  value,
  valueText,
}: SimulatorFilterSliderProps): JSX.Element {
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const sliderMax = Math.max(max, min + Math.max(step, 1));

  return (
    <Slider.Root
      min={min}
      max={sliderMax}
      step={step}
      value={value}
      disabled={disabled}
      className={cn(disabled && 'opacity-40')}
      onValueChange={(nextValue, eventDetails) => {
        setIsPointerDragging(eventDetails.reason === 'drag');
        onValueChange?.(nextValue);
      }}
      onValueCommitted={(nextValue) => {
        setIsPointerDragging(false);
        onValueCommitted?.(nextValue);
      }}
    >
      <Slider.Control
        className={cn(
          'relative flex touch-none items-center select-none',
          compact ? 'h-006 mx-008 w-[calc(100%-16px)]' : 'h-022 mx-[11px] w-[calc(100%-22px)]',
        )}
      >
        <Slider.Track
          className={cn(
            'bg-surface-default relative w-full rounded-[var(--radius-max)]',
            compact ? 'h-006' : 'h-010',
          )}
        >
          <Slider.Indicator
            className={cn(
              'bg-surface-highest h-full rounded-[var(--radius-max)]',
              'transition-[inset-inline-start,width] duration-150 ease-in-out',
              'motion-reduce:transition-none',
              isPointerDragging && 'transition-none',
            )}
          />
          <Slider.Thumb
            aria-label={label}
            aria-valuetext={valueText}
            className={cn(
              'bg-surface-lowest border-outline-default shadow-drop-shadow-01 relative cursor-grab rounded-[var(--radius-max)] border active:cursor-grabbing',
              'transition-[inset-inline-start,transform] duration-150 ease-in-out',
              'motion-reduce:transition-none',
              'has-[:focus-visible]:border-sys-primary-default',
              isPointerDragging && 'transition-none',
              compact ? 'size-016' : 'size-022',
            )}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
