'use client';

import type { JSX } from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { cn } from '@/shared/ui/cn';

type TabsRootProps = TabsPrimitive.Root.Props;
type TabsListProps = TabsPrimitive.List.Props;
type TabsTabProps = TabsPrimitive.Tab.Props;
type TabsIndicatorProps = TabsPrimitive.Indicator.Props;
type TabsPanelProps = TabsPrimitive.Panel.Props;

const rootClassName = 'flex w-full flex-col';

const listClassName = 'border-outline-low gap-012 relative flex w-full items-end border-b';

const tabClassName = [
  'relative z-10 shrink-0 px-004 pt-002 pb-012',
  'typo-subtitle-sm text-text-lower cursor-pointer border-0 bg-transparent',
  'data-active:text-text-high',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
].join(' ');

const indicatorClassName = [
  'bg-text-highest absolute bottom-0 left-0 z-0 h-[2px]',
  'w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
  'transition-[width,transform] duration-150 ease-out',
].join(' ');

const panelClassName = 'w-full outline-none';

const TabsRoot = ({ className, ...props }: TabsRootProps): JSX.Element => {
  return (
    <TabsPrimitive.Root
      className={(state) =>
        cn(rootClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const TabsList = ({ className, ...props }: TabsListProps): JSX.Element => {
  return (
    <TabsPrimitive.List
      className={(state) =>
        cn(listClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const TabsTab = ({ className, ...props }: TabsTabProps): JSX.Element => {
  return (
    <TabsPrimitive.Tab
      className={(state) =>
        cn(tabClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const TabsIndicator = ({ className, ...props }: TabsIndicatorProps): JSX.Element => {
  return (
    <TabsPrimitive.Indicator
      className={(state) =>
        cn(indicatorClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

const TabsPanel = ({ className, ...props }: TabsPanelProps): JSX.Element => {
  return (
    <TabsPrimitive.Panel
      className={(state) =>
        cn(panelClassName, typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
};

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
};
