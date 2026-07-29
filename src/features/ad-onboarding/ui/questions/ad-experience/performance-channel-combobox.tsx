'use client';

/**
 * 광고 성과 직접 입력에서 사용할 채널을 검색하고 단일 선택한다.
 */

import { useId, type JSX } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { Search } from 'lucide-react';

import {
  PERFORMANCE_CHANNEL_OPTION_LIST,
  type PerformanceChannelId,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { Text } from '@/shared/ui/text';

type PerformanceChannelOption = (typeof PERFORMANCE_CHANNEL_OPTION_LIST)[number];

export type PerformanceChannelComboboxProps = {
  value?: PerformanceChannelId;
  onValueChange: (value?: PerformanceChannelId) => void;
};

/** Base UI Combobox의 객체 value를 폼의 enum 스타일 channel id로 변환한다. */
export function PerformanceChannelCombobox({
  value,
  onValueChange,
}: PerformanceChannelComboboxProps): JSX.Element {
  const inputId = useId();
  const selectedOption =
    PERFORMANCE_CHANNEL_OPTION_LIST.find((option) => option.value === value) ?? null;

  return (
    <Combobox.Root<PerformanceChannelOption>
      items={PERFORMANCE_CHANNEL_OPTION_LIST}
      value={selectedOption}
      isItemEqualToValue={(option, selectedValue) => option.value === selectedValue.value}
      onValueChange={(option) => onValueChange(option?.value)}
    >
      <div className="gap-008 flex w-full flex-col">
        <Text as="label" htmlFor={inputId} variant="body-xl" className="text-text-medium">
          광고 채널
        </Text>
        <Combobox.InputGroup
          className={[
            'bg-surface-lower border-outline-default flex h-[42px] w-full items-center gap-010',
            'rounded-[var(--radius-s)] border px-014',
            'focus-within:border-outline-high focus-within:outline-2',
            'focus-within:outline-offset-2 focus-within:outline-outline-high',
          ].join(' ')}
        >
          <Search aria-hidden className="text-icon-default size-020 shrink-0" />
          <Combobox.Input
            id={inputId}
            aria-label="광고 채널"
            placeholder="광고 채널 검색"
            className={[
              'typo-subtitle-xxs text-text-high placeholder:text-text-low',
              'min-w-0 flex-1 bg-transparent outline-none',
            ].join(' ')}
          />
        </Combobox.InputGroup>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className="z-50 outline-none" sideOffset={4}>
          <Combobox.Popup
            className={[
              'bg-surface-lowest border-outline-default shadow-drop-shadow-01',
              'w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden',
              'origin-[var(--transform-origin)] rounded-[var(--radius-m)] border',
              'transition-[scale,opacity] duration-150',
              'data-starting-style:scale-95 data-starting-style:opacity-0',
              'data-ending-style:scale-95 data-ending-style:opacity-0',
              'motion-reduce:transition-none',
            ].join(' ')}
          >
            <Combobox.Empty className="px-016 py-010">
              <Text variant="body-xl" className="text-text-low">
                일치하는 광고 채널이 없어요
              </Text>
            </Combobox.Empty>
            <Combobox.List className="max-h-[210px] overflow-y-auto overscroll-contain outline-none">
              {(option: PerformanceChannelOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className={[
                    'typo-subtitle-xxs text-text-high flex cursor-pointer items-center',
                    'border-outline-default min-h-[42px] border-b px-016 py-010 outline-none',
                    'last:border-b-0 hover:bg-surface-lower data-highlighted:bg-surface-lower',
                    'data-selected:text-text-primary',
                  ].join(' ')}
                >
                  {option.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
