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
} from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

const ARROW_SIZE_PX = 8;
const ARROW_STATIC_OFFSET = `-${ARROW_SIZE_PX / 2}px`;
const ARROW_MIDDLEWARE_PADDING = 6;
const SHIFT_PADDING = 8;

export type TooltipRootProps = PropsWithChildren<{
  placement?: Placement;
  offset?: OffsetOptions;
  strategy?: 'absolute' | 'fixed';
}>;

export type TooltipAnchorProps = ComponentPropsWithoutRef<'span'>;

export type TooltipContentProps = ComponentPropsWithoutRef<'div'> & {
  arrowClassName?: string;
  showArrow?: boolean;
};

type TooltipArrowProps = ComponentPropsWithoutRef<'span'>;

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

const Root = ({
  placement = 'top',
  offset = 8,
  strategy = 'fixed',
  children,
}: TooltipRootProps): JSX.Element => {
  const arrowRef = useRef<HTMLSpanElement | null>(null);
  const middleware = useMemo(
    () => [
      offsetMiddleware(offset),
      flipMiddleware(),
      shiftMiddleware({ padding: SHIFT_PADDING }),
      arrowMiddleware({ element: arrowRef, padding: ARROW_MIDDLEWARE_PADDING }),
    ],
    [offset],
  );
  const floating = useFloating({
    placement,
    strategy,
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
  arrowClassName,
  className,
  style,
  children,
  showArrow = true,
  ...props
}: TooltipContentProps): JSX.Element => {
  const { refs, floatingStyles } = useTooltipContext();

  const content = (
    <Box
      ref={refs.setFloating}
      className={cn(
        'z-50 flex w-max max-w-[min(240px,calc(100vw-32px))] items-center justify-center',
        'rounded-[var(--radius-s)] bg-surface-high px-012 py-006 text-text-lowest shadow-drop-shadow-01',
        className,
      )}
      style={{ ...floatingStyles, ...style }}
      {...props}
    >
      <Text variant="caption-lg" className="text-center break-words">
        {children}
      </Text>
      {showArrow ? <Arrow className={arrowClassName} /> : null}
    </Box>
  );

  return content;
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
    [staticSide]: ARROW_STATIC_OFFSET,
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
};
