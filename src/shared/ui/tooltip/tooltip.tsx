'use client';

import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
  useFloating,
  type OffsetOptions,
  type Placement,
} from '@floating-ui/react-dom';
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type JSX,
  type MutableRefObject,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export type TooltipRootProps = PropsWithChildren<{
  placement?: Placement;
  offset?: OffsetOptions;
}>;

export type TooltipAnchorProps = ComponentPropsWithoutRef<'span'>;

export type TooltipContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  showArrow?: boolean;
};

export type TooltipArrowProps = ComponentPropsWithoutRef<'span'>;

type TooltipContextValue = ReturnType<typeof useFloating> & {
  arrowRef: MutableRefObject<HTMLSpanElement | null>;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error('Tooltip compound components must be rendered inside Tooltip.Root');
  }

  return context;
};

const Root = ({ placement = 'top', offset = 8, children }: TooltipRootProps): JSX.Element => {
  const arrowRef = useRef<HTMLSpanElement | null>(null);
  const middleware = useMemo(
    () => [
      offsetMiddleware(offset),
      flipMiddleware(),
      shiftMiddleware({ padding: 8 }),
      arrowMiddleware({ element: arrowRef, padding: 6 }),
    ],
    [offset],
  );
  const floating = useFloating({
    placement,
    strategy: 'fixed',
    middleware,
    whileElementsMounted: autoUpdate,
  });
  const value = useMemo(
    () => ({
      ...floating,
      arrowRef,
    }),
    [floating],
  );

  return <TooltipContext value={value}>{children}</TooltipContext>;
};

const Anchor = ({ className, ...props }: TooltipAnchorProps): JSX.Element => {
  const { refs } = useTooltipContext();

  return (
    <Box
      as="span"
      ref={refs.setReference}
      className={cn('inline-flex w-fit shrink-0', className)}
      {...props}
    />
  );
};

const Content = ({
  className,
  style,
  children,
  showArrow = true,
  ...props
}: TooltipContentProps): JSX.Element => {
  const { refs, floatingStyles } = useTooltipContext();

  return (
    <Box
      ref={refs.setFloating}
      className={cn(
        'z-50 flex w-max max-w-[min(240px,calc(100vw-32px))] items-center justify-center',
        'rounded-s bg-surface-high px-012 py-006 text-text-lowest shadow-drop-shadow-01',
        className,
      )}
      style={{ ...floatingStyles, ...style }}
      {...props}
    >
      <Text variant="caption-lg" className="text-center break-words">
        {children}
      </Text>
      {showArrow ? <Arrow /> : null}
    </Box>
  );
};

const STATIC_SIDE_BY_PLACEMENT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

const resolveArrowPosition = (value: number | undefined) => {
  return value === undefined ? undefined : `${value}px`;
};

const Arrow = ({ className, style, ...props }: TooltipArrowProps): JSX.Element => {
  const { arrowRef, middlewareData, placement } = useTooltipContext();
  const side = placement.split('-')[0] as keyof typeof STATIC_SIDE_BY_PLACEMENT;
  const staticSide = STATIC_SIDE_BY_PLACEMENT[side];
  const arrowData = middlewareData.arrow;
  const arrowStyle = {
    left: resolveArrowPosition(arrowData?.x),
    top: resolveArrowPosition(arrowData?.y),
    right: '',
    bottom: '',
    [staticSide]: '-4px',
    ...style,
  } satisfies CSSProperties;

  return (
    <Box
      as="span"
      aria-hidden="true"
      ref={arrowRef}
      className={cn('absolute size-008 rotate-45 bg-surface-high', className)}
      style={arrowStyle}
      {...props}
    />
  );
};

export const Tooltip = {
  Root,
  Anchor,
  Content,
  Arrow,
};
