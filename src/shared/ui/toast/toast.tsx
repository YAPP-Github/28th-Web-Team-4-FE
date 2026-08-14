'use client';

import type { ReactNode } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { Check } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/shared/ui/cn';

type ToastType = 'warning' | 'success';

export type ShowToastOptions = {
  id?: string;
  description: string;
  timeout?: number;
  type?: ToastType;
};

const toastManager = BaseToast.createToastManager();

const toastRootClassName = cn([
  '[--gap:8px] [--peek:10px] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))]',
  '[--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))]',
  '[--offset-y:calc((var(--toast-offset-y)*-1)+(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]',
  'bg-surface-toast shadow-drop-shadow-01 text-text-lowest relative right-auto bottom-auto left-auto',
  'z-[calc(1000-var(--toast-index))] h-[var(--height)] w-fit max-w-full origin-bottom rounded-[var(--radius-s)] backdrop-blur-[2px]',
  'select-none will-change-transform',
  '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
  'after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[""]',
  'data-expanded:h-[var(--toast-height)] data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
  'data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]',
  'data-[ending-style]:opacity-0',
  '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
  'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
  'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
  'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
  'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
  'motion-safe:[transition:transform_280ms_cubic-bezier(0.22,1,0.36,1),opacity_220ms_ease,height_150ms_ease]',
  'motion-reduce:transition-none motion-reduce:data-[starting-style]:opacity-0 motion-reduce:data-[starting-style]:[transform:none]',
  'motion-reduce:data-[ending-style]:opacity-0 motion-reduce:data-[ending-style]:[transform:none]',
]);

const toastContentClassName = cn([
  'gap-010 flex h-full items-center overflow-hidden px-016 py-010',
  'motion-safe:transition-opacity motion-safe:duration-[220ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
  'data-behind:opacity-0 data-expanded:opacity-100 motion-reduce:transition-none',
]);

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return toasts.map((toast) => {
    const isWarning = toast.type === 'warning';

    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        swipeDirection="up"
        className={toastRootClassName}
      >
        <BaseToast.Content className={toastContentClassName}>
          {isWarning ? (
            <Image
              src="/shared-assets/warning-white.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="size-016 shrink-0"
            />
          ) : (
            <span className="bg-surface-lowest size-016 flex shrink-0 items-center justify-center rounded-full">
              <Check aria-hidden="true" className="text-text-medium size-012" strokeWidth={2} />
            </span>
          )}
          <BaseToast.Description className="typo-subtitle-xxs text-text-lowest text-center whitespace-nowrap" />
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <BaseToast.Provider toastManager={toastManager}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className={cn([
            'fixed bottom-[121px] left-1/2 z-[1000] w-[min(calc(100vw-32px),360px)] -translate-x-1/2',
            'flex flex-col items-center',
            'outline-none',
          ])}
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export function showToast({ id, description, timeout = 2000, type = 'warning' }: ShowToastOptions) {
  toastManager.add({
    id,
    description,
    timeout,
    type,
  });
}

export function showWarningToast(
  description: string,
  options: Omit<ShowToastOptions, 'description' | 'type'> = {},
) {
  showToast({ ...options, description, type: 'warning' });
}
