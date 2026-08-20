'use client';

import type { JSX } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { Plus, Search } from 'lucide-react';

import type { ComparisonChannelOption } from '@/pages/compare/model/comparison-channel-option';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

const PICKER_SKELETON_ROW_IDS = ['first', 'second', 'third', 'fourth', 'fifth'] as const;

export type CompareResultChannelPickerProps = {
  disabled?: boolean;
  isError: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
  onSearchKeywordChange: (searchKeyword: string) => void;
  onSelect: (option: ComparisonChannelOption) => void;
  open: boolean;
  options: readonly ComparisonChannelOption[];
  searchKeyword: string;
};

function PickerStatus({
  isError,
  isPending,
  onRetry,
}: Pick<CompareResultChannelPickerProps, 'isError' | 'isPending' | 'onRetry'>): JSX.Element | null {
  if (isPending) {
    return (
      <Box role="status" className="flex flex-col">
        <Text as="span" variant="body-xl" className="sr-only">
          채널을 불러오고 있어요
        </Text>
        {PICKER_SKELETON_ROW_IDS.map((rowId) => (
          <Box key={rowId} className="bg-surface-lowest px-016 py-010 flex h-[42px] items-center">
            <Skeleton
              data-testid="channel-picker-skeleton"
              className="h-012 w-[100px] rounded-[var(--radius-xxs)]"
            />
          </Box>
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Box role="alert" className="gap-012 px-016 py-020 flex flex-col items-center">
        <Text variant="body-xl" className="text-text-medium text-center">
          채널 목록을 불러오지 못했어요
        </Text>
        <Button frame="button" tone="stroke" className="h-036 px-012" onClick={onRetry}>
          다시 시도
        </Button>
      </Box>
    );
  }

  return null;
}

export function CompareResultChannelPicker({
  disabled = false,
  isError,
  isPending,
  onOpenChange,
  onRetry,
  onSearchKeywordChange,
  onSelect,
  open,
  options,
  searchKeyword,
}: CompareResultChannelPickerProps): JSX.Element {
  const hasSearchKeyword = searchKeyword.trim().length > 0;
  const showList = !isPending && !isError;

  return (
    <Box className="flex h-full w-full lg:w-[256px]">
      <Combobox.Root<ComparisonChannelOption>
        items={options}
        filter={null}
        inputValue={searchKeyword}
        open={open}
        value={null}
        disabled={disabled}
        autoHighlight
        itemToStringLabel={(option) => option.name}
        itemToStringValue={(option) => option.id}
        isItemEqualToValue={(option, selectedOption) => option.id === selectedOption.id}
        onOpenChange={(nextOpen) => {
          onOpenChange(nextOpen);
        }}
        onInputValueChange={(nextSearchKeyword) => {
          onSearchKeywordChange(nextSearchKeyword);
        }}
        onValueChange={(option) => {
          if (option) {
            onSelect(option);
          }
        }}
      >
        <Combobox.Label className="sr-only">비교할 채널 추가</Combobox.Label>
        <Combobox.Trigger
          aria-label="비교할 채널 추가"
          className={[
            'bg-surface-background-default border-outline-default text-text-low',
            'flex h-full w-full shrink-0 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-m)] border border-dashed lg:w-[256px]',
            'transition-colors outline-none hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-high',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          <Plus aria-hidden className="text-icon-default size-016" strokeWidth={1.8} />
          <Text variant="body-xl" className="mt-004">
            채널 추가하기
          </Text>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner
            className="z-50 outline-none"
            side="bottom"
            align="start"
            sideOffset={6}
            collisionAvoidance={{ side: 'flip', align: 'shift', fallbackAxisSide: 'none' }}
            collisionPadding={16}
          >
            <Combobox.Popup
              aria-label="추가할 채널 선택"
              aria-busy={isPending || undefined}
              className={[
                'bg-surface-lowest border-outline-default relative w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden rounded-[var(--radius-m)] border py-010',
                'origin-[var(--transform-origin)] opacity-100 transition-[scale,opacity] duration-150',
                'data-starting-style:scale-95 data-starting-style:opacity-0',
                'data-ending-style:scale-95 data-ending-style:opacity-0',
                'motion-reduce:transition-none',
              ].join(' ')}
            >
              <Box className="px-016 pt-004 pb-010">
                <Combobox.InputGroup className="bg-surface-low focus-within:border-outline-high h-036 gap-006 p-008 flex items-center rounded-[var(--radius-s)] border border-transparent">
                  <Search
                    aria-hidden
                    className="text-icon-default size-020 shrink-0"
                    strokeWidth={1.8}
                  />
                  <Combobox.Input
                    autoFocus
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="추가할 채널 검색"
                    placeholder="검색"
                    className="typo-subtitle-xl text-text-highest placeholder:text-text-low min-w-0 flex-1 bg-transparent outline-none"
                  />
                </Combobox.InputGroup>
              </Box>

              <PickerStatus isError={isError} isPending={isPending} onRetry={onRetry} />

              <>
                {showList && hasSearchKeyword ? (
                  <Combobox.Empty>
                    <Box className="px-016 py-020 flex justify-center">
                      <Text variant="body-xl" className="text-text-low text-center">
                        검색 결과가 없어요
                      </Text>
                    </Box>
                  </Combobox.Empty>
                ) : null}
                <Combobox.List
                  className={cn(
                    'scroll-py-006 max-h-[min(480px,calc(var(--available-height)-72px))] overflow-y-auto overscroll-contain outline-none',
                    !showList && 'hidden',
                  )}
                >
                  {(option: ComparisonChannelOption) => (
                    <Combobox.Item
                      key={option.id}
                      value={option}
                      disabled={option.isDisabled}
                      render={({ className, ...itemProps }) => (
                        <Box
                          className={cn(
                            [
                              'flex min-h-[34px] w-full cursor-pointer items-center gap-010 px-016 py-006 outline-none select-none',
                              'hover:not-data-disabled:bg-surface-low data-highlighted:bg-surface-low data-disabled:cursor-not-allowed',
                            ],
                            className,
                          )}
                          {...itemProps}
                        >
                          <Checkbox
                            aria-hidden
                            checked={false}
                            disabled={option.isDisabled}
                            readOnly
                            renderMode="label-control"
                            size="s"
                            className="pointer-events-none focus-visible:outline-none"
                          />
                          <Text
                            variant="subtitle-xxs"
                            className={cn(
                              'min-w-0 flex-1 truncate',
                              option.isDisabled ? 'text-text-low' : 'text-text-high',
                            )}
                          >
                            {option.name}
                          </Text>
                          {option.isRecommended ? (
                            <Badge
                              frame="indicator"
                              tone="orange"
                              size="s"
                              className="bg-sys-primary-lowest"
                            >
                              추천
                            </Badge>
                          ) : null}
                        </Box>
                      )}
                    />
                  )}
                </Combobox.List>
                {showList ? (
                  <Box
                    aria-hidden
                    className="from-surface-lowest pointer-events-none absolute inset-x-px bottom-px h-[45px] rounded-b-[var(--radius-m)] bg-gradient-to-t to-transparent"
                  />
                ) : null}
              </>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Box>
  );
}
