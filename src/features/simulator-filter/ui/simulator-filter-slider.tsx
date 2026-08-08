'use client';

import { useState, type JSX } from 'react';
import { Slider } from '@base-ui/react/slider';

import { cn } from '@/shared/ui/cn';
import { Tooltip } from '@/shared/ui/tooltip';

export type SimulatorFilterSliderProps = {
  compact?: boolean;
  disabled?: boolean;
  label: string;
  max: number;
  min: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  showTooltip?: boolean;
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
  showTooltip = false,
  step = 1,
  value,
  valueText,
}: SimulatorFilterSliderProps): JSX.Element {
  const [isInteracting, setIsInteracting] = useState(false);
  const sliderMax = Math.max(max, min + Math.max(step, 1));
  const valuePercentage = Math.min(100, Math.max(0, ((value - min) / (sliderMax - min)) * 100));

  return (
    <Slider.Root
      min={min}
      max={sliderMax}
      step={step}
      value={[value]}
      disabled={disabled}
      className={cn(disabled && 'opacity-40')}
      onValueChange={(values) => {
        setIsInteracting(true);
        onValueChange?.(values[0] ?? value);
      }}
      onValueCommitted={(values) => {
        const committedValue = values[0] ?? value;

        onValueCommitted?.(committedValue);
        setIsInteracting(false);
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
          <Slider.Indicator className="bg-surface-highest h-full rounded-[var(--radius-max)]" />
          <Slider.Thumb
            index={0}
            aria-label={label}
            aria-valuetext={valueText}
            className={cn(
              'bg-surface-lowest border-outline-default shadow-drop-shadow-01 relative rounded-[var(--radius-max)] border',
              compact ? 'size-016' : 'size-022',
            )}
          />
        </Slider.Track>
        {showTooltip && !disabled && isInteracting ? (
          <Tooltip.Root
            placement="top"
            offset={8}
            strategy="absolute"
            allowFlip={false}
            allowShift={false}
          >
            <Tooltip.Anchor
              aria-hidden
              className="pointer-events-none absolute top-1/2 size-px"
              style={{ left: `${valuePercentage}%` }}
            />
            <Tooltip.Content
              className="bg-surface-highest px-012 py-006"
              arrowClassName="bg-surface-highest"
            >
              {valueText}
            </Tooltip.Content>
          </Tooltip.Root>
        ) : null}
      </Slider.Control>
    </Slider.Root>
  );
}
