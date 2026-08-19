'use client';

import Image from 'next/image';
import { useState, type JSX, type ReactNode } from 'react';
import { Popover } from '@base-ui/react/popover';
import { ChevronDown, Minus, Search } from 'lucide-react';
import { Input as BaseInput } from '@base-ui/react/input';

import {
  CHANNEL_CATEGORY_OPTION_LIST,
  type ChannelCategory,
  type ChannelListItem,
} from '@/features/channel-selection/model/channel-page';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { ChannelLogo } from './channel-logo';

type OpenPopover = 'category' | 'selectedChannels' | null;

const POPUP_CLASSES = cn(
  'origin-top-left bg-surface-lowest shadow-drop-shadow-03 w-[min(290px,calc(100vw-32px))] rounded-[var(--radius-m)] outline-none',
  'scale-100 opacity-100 transition-[transform,opacity] duration-200 ease-out',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0',
  'motion-reduce:scale-100 motion-reduce:transition-opacity',
  'motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100',
);

const FILTER_TRIGGER_CLASSES = cn(
  'group flex h-036 w-full min-w-0 flex-1 cursor-pointer items-center justify-between rounded-[var(--radius-s)] px-018',
  'sm:w-[126px] sm:flex-none sm:shrink-0',
  'text-text-medium hover:bg-surface-low outline-none transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sys-primary-default',
);

const POPOVER_ACTION_BUTTON_CLASSES = cn(
  'text-text-low focus-visible:outline-sys-primary-default cursor-pointer rounded-[var(--radius-xs)] outline-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default',
);

type ComparisonChannelSelectionSubHeaderProps = {
  category: readonly ChannelCategory[];
  onCategoryChange: (category: ChannelCategory[]) => void;
  onClearSelection: () => void;
  onQueryChange: (query: string) => void;
  onRemoveChannel: (channelId: string) => void;
  query: string;
  selectedChannels: readonly ChannelListItem[];
  title: string;
};

function PopoverActionButton({
  children,
  className,
  type = 'button',
  ...props
}: JSX.IntrinsicElements['button']): JSX.Element {
  return (
    <button type={type} className={cn(POPOVER_ACTION_BUTTON_CLASSES, className)} {...props}>
      <Text variant="body-xl" className="text-text-low">
        {children}
      </Text>
    </button>
  );
}

function FilterTrigger({
  accessibleName,
  count,
  iconSrc,
  isActive,
  isOpen,
  label,
}: {
  accessibleName: string;
  count: number;
  iconSrc: string;
  isActive: boolean;
  isOpen: boolean;
  label: string;
}): JSX.Element {
  return (
    <Popover.Trigger className={FILTER_TRIGGER_CLASSES} aria-label={accessibleName}>
      <Box className="gap-008 flex min-w-0 items-center">
        <Image
          aria-hidden
          src={iconSrc}
          alt=""
          width={22}
          height={22}
          className="size-022 shrink-0"
        />
        <Box className="flex min-w-0 items-center">
          <Text variant="subtitle-xxl" className="truncate">
            {label}
          </Text>
          <Text
            variant="subtitle-xxl"
            className={cn('shrink-0', isActive ? 'text-text-primary' : 'text-text-medium')}
          >
            {count}개
          </Text>
        </Box>
      </Box>
      <ChevronDown
        aria-hidden
        className={cn('size-022 shrink-0 transition-transform', isOpen && 'rotate-180')}
        strokeWidth={1.8}
      />
    </Popover.Trigger>
  );
}

function PopupPositioner({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Popover.Portal>
      <Popover.Positioner
        side="bottom"
        align="start"
        sideOffset={28}
        collisionPadding={16}
        data-side-offset="28"
        data-collision-padding="16"
        className="z-50 outline-none"
      >
        {children}
      </Popover.Positioner>
    </Popover.Portal>
  );
}

function CategoryPopover({
  category,
  isOpen,
  onCategoryChange,
  onOpenChange,
}: {
  category: readonly ChannelCategory[];
  isOpen: boolean;
  onCategoryChange: (category: ChannelCategory[]) => void;
  onOpenChange: (open: boolean) => void;
}): JSX.Element {
  const selectedCategories = new Set(category);

  const toggleCategory = (value: ChannelCategory, checked: boolean) => {
    const nextCategories = new Set(category);

    if (checked) {
      nextCategories.add(value);
    } else {
      nextCategories.delete(value);
    }

    onCategoryChange(
      CHANNEL_CATEGORY_OPTION_LIST.flatMap((option) =>
        nextCategories.has(option.value) ? [option.value] : [],
      ),
    );
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <FilterTrigger
        accessibleName={`카테고리, ${category.length}개 선택됨`}
        count={category.length}
        iconSrc="/channel-selection-assets/category-filter.png"
        isActive={category.length > 0}
        isOpen={isOpen}
        label=""
      />
      <PopupPositioner>
        <Popover.Popup data-testid="category-popover" className={cn(POPUP_CLASSES, 'py-012')}>
          <Box className="px-018 py-006 h-044 flex items-center justify-between">
            <Popover.Title className="m-0">
              <Text variant="subtitle-lg" className="text-text-highest">
                선택한 카테고리{' '}
                <span className={category.length > 0 ? 'text-text-primary' : 'text-text-low'}>
                  {category.length}
                </span>
              </Text>
            </Popover.Title>
            <PopoverActionButton
              aria-label="카테고리 선택 초기화"
              disabled={category.length === 0}
              onClick={() => onCategoryChange([])}
            >
              초기화
            </PopoverActionButton>
          </Box>
          <Box className="relative">
            <Box as="ul" className="max-h-[340px] scroll-pb-[45px] overflow-y-auto">
              {CHANNEL_CATEGORY_OPTION_LIST.map((option) => {
                const checkboxId = `channel-category-${option.value.toLowerCase()}`;

                return (
                  <Box as="li" key={option.value}>
                    <label
                      htmlFor={checkboxId}
                      className="gap-010 px-018 py-006 hover:bg-surface-low flex min-h-[34px] w-full cursor-pointer items-center select-none"
                    >
                      <Checkbox
                        id={checkboxId}
                        aria-label={`${option.label} 선택`}
                        checked={selectedCategories.has(option.value)}
                        onCheckedChange={(checked) => toggleCategory(option.value, checked)}
                        renderMode="label-control"
                        size="s"
                      />
                      <Text variant="subtitle-xxs" className="text-text-high">
                        {option.label}
                      </Text>
                    </label>
                  </Box>
                );
              })}
            </Box>
            <Box
              aria-hidden
              className="from-surface-lowest pointer-events-none absolute inset-x-0 bottom-0 h-[45px] bg-gradient-to-t to-transparent"
            />
          </Box>
        </Popover.Popup>
      </PopupPositioner>
    </Popover.Root>
  );
}

function SelectedChannelsPopover({
  isOpen,
  onClearSelection,
  onOpenChange,
  onRemoveChannel,
  selectedChannels,
}: {
  isOpen: boolean;
  onClearSelection: () => void;
  onOpenChange: (open: boolean) => void;
  onRemoveChannel: (channelId: string) => void;
  selectedChannels: readonly ChannelListItem[];
}): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const selectedCount = selectedChannels.length;
  const isEmpty = selectedCount === 0;

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <FilterTrigger
        accessibleName={`선택한 채널, ${selectedCount}개 선택됨`}
        count={selectedCount}
        iconSrc="/channel-selection-assets/channel-filter.png"
        isActive={!isEmpty}
        isOpen={isOpen}
        label=""
      />
      <PopupPositioner>
        <Popover.Popup
          data-testid="selected-channels-popover"
          className={cn(POPUP_CLASSES, 'py-012', isEmpty && 'h-[130px]')}
        >
          <Box className="px-018 py-006 h-046 flex items-center justify-between">
            <Popover.Title className="m-0">
              <Text variant="subtitle-lg" className="text-text-highest">
                선택한 채널{' '}
                <span className={isEmpty ? 'text-text-low' : 'text-text-primary'}>
                  {selectedCount}
                </span>
              </Text>
            </Popover.Title>
            <Box className="gap-016 flex items-center">
              <PopoverActionButton disabled={isEmpty} onClick={onClearSelection}>
                초기화
              </PopoverActionButton>
              {isEditing ? (
                <PopoverActionButton onClick={() => setIsEditing(false)}>완료</PopoverActionButton>
              ) : (
                <PopoverActionButton disabled={isEmpty} onClick={() => setIsEditing(true)}>
                  편집
                </PopoverActionButton>
              )}
            </Box>
          </Box>
          {isEmpty ? (
            <Popover.Description className="px-018 py-006 m-0 flex h-[60px] flex-col justify-center">
              <Text variant="subtitle-xxs" className="text-text-low">
                아직 선택한 채널이 없어요.
              </Text>
              <Text variant="subtitle-xxs" className="text-text-low">
                채널 카드를 눌러 비교할 채널을 골라 보세요.
              </Text>
            </Popover.Description>
          ) : (
            <Box as="ul">
              {selectedChannels.map((channel) => (
                <Box as="li" key={channel.id} className="gap-010 px-018 h-044 flex items-center">
                  {isEditing ? (
                    <button
                      type="button"
                      aria-label={`${channel.name} 선택 해제`}
                      onClick={() => onRemoveChannel(channel.id)}
                      className="bg-sys-error-default size-020 focus-visible:outline-sys-primary-default flex shrink-0 items-center justify-center rounded-[var(--radius-max)] text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Minus aria-hidden className="size-012" strokeWidth={2.5} />
                    </button>
                  ) : null}
                  <ChannelLogo channel={channel} variant="selected" />
                  <Text variant="subtitle-xxs" className="text-text-high min-w-0 truncate">
                    {channel.name}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Popover.Popup>
      </PopupPositioner>
    </Popover.Root>
  );
}

export function ComparisonChannelSelectionSubHeader({
  category,
  onCategoryChange,
  onClearSelection,
  onQueryChange,
  onRemoveChannel,
  query,
  selectedChannels,
  title,
}: ComparisonChannelSelectionSubHeaderProps): JSX.Element {
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);

  return (
    <Box className="border-outline-low bg-surface-lowest min-h-072 px-016 py-016 sm:px-032 flex w-full shrink-0 justify-center border-y lg:px-120 lg:py-0">
      <Box className="gap-016 lg:h-072 flex w-full max-w-[1200px] flex-col lg:flex-row lg:items-center lg:justify-between">
        <Text as="h1" variant="heading-lg" className="text-text-highest shrink-0">
          {title}
        </Text>
        <Box className="gap-016 sm:gap-018 flex w-full min-w-0 flex-col sm:flex-row sm:items-center lg:w-auto">
          <Box className="gap-018 flex w-full min-w-0 items-center sm:w-auto sm:shrink-0">
            <CategoryPopover
              category={category}
              isOpen={openPopover === 'category'}
              onCategoryChange={onCategoryChange}
              onOpenChange={(open) => setOpenPopover(open ? 'category' : null)}
            />
            <Box aria-hidden className="border-outline-low h-[34px] border-l" />
            <SelectedChannelsPopover
              isOpen={openPopover === 'selectedChannels'}
              onClearSelection={onClearSelection}
              onOpenChange={(open) => setOpenPopover(open ? 'selectedChannels' : null)}
              onRemoveChannel={onRemoveChannel}
              selectedChannels={selectedChannels}
            />
          </Box>
          <Box
            aria-hidden
            className="border-outline-low hidden h-[34px] shrink-0 border-l sm:block"
          />
          <Box
            className={cn(
              'bg-surface-lower flex h-036 w-full min-w-0 items-center gap-006 rounded-[var(--radius-s)] p-008',
              'sm:flex-1 lg:w-[282px] lg:flex-none',
              'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sys-primary-default',
            )}
          >
            <Search aria-hidden className="size-020 text-icon-default shrink-0" strokeWidth={1.8} />
            <BaseInput
              value={query}
              onChange={(event) => onQueryChange(event.currentTarget.value)}
              aria-label="채널 검색"
              placeholder="채널 검색"
              className="typo-subtitle-xxs text-text-highest placeholder:text-text-low min-w-0 flex-1 bg-transparent outline-none"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
