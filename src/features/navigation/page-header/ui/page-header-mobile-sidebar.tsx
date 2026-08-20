'use client';

import { useRef, useState, useSyncExternalStore, type CSSProperties, type JSX } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Logo } from '@/shared/ui/logo';
import { Text } from '@/shared/ui/text';

import { HeaderLoginButton } from './header-login-button';
import { PageHeaderNavLink } from './page-header-nav-link';
import { PAGE_HEADER_NAVIGATION_ITEMS } from './page-header-navigation-items';

export type PageHeaderMobileSidebarProps = {
  isLogin: boolean;
  userName?: string;
};

const iconButtonClassName =
  'focus-visible:outline-sys-primary-default flex size-11 cursor-pointer items-center justify-center rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2';

const MOBILE_VIEWPORT_QUERY = '(max-width: 1023px)';
const MOBILE_SIDEBAR_ID = 'page-header-mobile-sidebar';
const MOBILE_SIDEBAR_TRIGGER_ID = 'page-header-mobile-sidebar-trigger';
const SIDEBAR_EXIT_EASE = [0.215, 0.61, 0.355, 1] as const;
const menuIconTransitionClassName =
  'duration-[180ms] ease-[var(--ease-in-out-cubic,cubic-bezier(0.645,0.045,0.355,1))] motion-reduce:transition-none';

type SidebarItemAnimationStyle = CSSProperties & {
  '--sidebar-item-index': number;
};

function getSidebarItemAnimationStyle(index: number): SidebarItemAnimationStyle {
  return { '--sidebar-item-index': index };
}

const sidebarExitVariants = {
  open: {
    opacity: 1,
    transform: 'translateY(0%) scale(1)',
  },
  exit: {
    opacity: 0,
    transform: 'translateY(-100%) scale(1)',
    transition: {
      duration: 0.22,
      ease: SIDEBAR_EXIT_EASE,
    },
  },
} satisfies Variants;

type MenuMorphIconProps = {
  open: boolean;
};

function MenuMorphIcon({ open }: MenuMorphIconProps): JSX.Element {
  return (
    <svg
      aria-hidden
      data-menu-icon={open ? 'close' : 'menu'}
      viewBox="0 0 20 20"
      fill="none"
      className="size-020 shrink-0"
    >
      <g
        className={cn(
          menuIconTransitionClassName,
          'transition-opacity starting:opacity-100',
          open && 'opacity-0',
        )}
      >
        <line
          x1="3"
          y1="5"
          x2="17"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g
        className={cn(
          menuIconTransitionClassName,
          'origin-[10px_10px] transition-[rotate] starting:rotate-0',
          open && 'rotate-45',
        )}
      >
        <line
          x1="3"
          y1="10"
          x2="17"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g
        data-menu-line="secondary"
        className={cn(
          menuIconTransitionClassName,
          'origin-[10px_10px] opacity-0 transition-[opacity,rotate] starting:rotate-0 starting:opacity-0',
          open && '-rotate-45 opacity-100',
        )}
      >
        <line
          x1="3"
          y1="10"
          x2="17"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g
        className={cn(
          menuIconTransitionClassName,
          'transition-opacity starting:opacity-100',
          open && 'opacity-0',
        )}
      >
        <line
          x1="3"
          y1="15"
          x2="17"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function subscribeToMobileViewport(onStoreChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(MOBILE_VIEWPORT_QUERY);

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => mediaQueryList.removeEventListener('change', onStoreChange);
}

function getIsMobileViewport(): boolean {
  return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}

function getServerIsMobileViewport(): boolean {
  return true;
}

export function PageHeaderMobileSidebar({
  isLogin,
  userName,
}: PageHeaderMobileSidebarProps): JSX.Element | null {
  const [sidebarOpenIntent, setSidebarOpenIntent] = useState(false);
  const drawerActionsRef = useRef<Drawer.Root.Actions | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getIsMobileViewport,
    getServerIsMobileViewport,
  );
  const sidebarOpen = sidebarOpenIntent && isMobileViewport;
  const enterAnimationPlayStateClassName = sidebarOpen
    ? 'motion-safe:[animation-play-state:running]'
    : 'motion-safe:[animation-play-state:paused]';
  const closeSidebar = () => {
    if (drawerActionsRef.current) {
      drawerActionsRef.current.close();
      return;
    }

    setSidebarOpenIntent(false);
  };
  const handleSidebarOpenChange = (
    nextOpen: boolean,
    eventDetails: Drawer.Root.ChangeEventDetails,
  ) => {
    if (!nextOpen && !shouldReduceMotion) {
      eventDetails.preventUnmountOnClose();
    }

    setSidebarOpenIntent(nextOpen);
  };

  if (!isMobileViewport) {
    return null;
  }

  return (
    <Drawer.Root
      open={sidebarOpen}
      onOpenChange={handleSidebarOpenChange}
      actionsRef={drawerActionsRef}
      triggerId={MOBILE_SIDEBAR_TRIGGER_ID}
      swipeDirection="up"
      modal
      disablePointerDismissal
    >
      <Drawer.Trigger
        id={MOBILE_SIDEBAR_TRIGGER_ID}
        aria-label="메뉴 열기"
        aria-controls={MOBILE_SIDEBAR_ID}
        aria-expanded={sidebarOpen}
        className={`${iconButtonClassName} -mr-3`}
      >
        <MenuMorphIcon open={sidebarOpen} />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Viewport className="fixed inset-0 z-50 lg:hidden">
          <Drawer.Popup
            id={MOBILE_SIDEBAR_ID}
            className="relative h-full w-full touch-auto overflow-hidden outline-none"
          >
            <Drawer.Title className="sr-only">전체 메뉴</Drawer.Title>

            <Drawer.Content className="flex h-full min-h-0 flex-col">
              <Box className="bg-surface-lowest border-outline-low px-020 flex h-14 shrink-0 items-center justify-between border-b">
                <Link
                  href="/"
                  aria-label="chaesozip"
                  onClick={closeSidebar}
                  className="focus-visible:outline-sys-primary-default shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Logo type="s" alt="" />
                </Link>
                <Drawer.Close aria-label="메뉴 닫기" className={`${iconButtonClassName} -mr-3`}>
                  <MenuMorphIcon open={sidebarOpen} />
                </Drawer.Close>
              </Box>

              <Box className="min-h-0 flex-1 [transform:translateY(var(--drawer-swipe-movement-y))] overflow-hidden">
                <motion.div
                  data-testid="mobile-sidebar-panel"
                  className="h-full w-full"
                  variants={sidebarExitVariants}
                  initial={false}
                  animate={sidebarOpen ? 'open' : 'exit'}
                  onAnimationComplete={(definition) => {
                    if (definition === 'exit' && !sidebarOpen) {
                      drawerActionsRef.current?.unmount();
                    }
                  }}
                >
                  <Box
                    className={cn(
                      'bg-surface-lowest h-full w-full origin-top motion-safe:animate-page-header-mobile-sidebar-enter',
                      enterAnimationPlayStateClassName,
                    )}
                  >
                    <Box className="gap-020 p-020 flex h-full min-h-0 flex-col overflow-y-auto">
                      <Box
                        as="nav"
                        aria-label="모바일 주요 메뉴"
                        className="gap-026 flex min-h-0 flex-1 flex-col items-start"
                      >
                        {PAGE_HEADER_NAVIGATION_ITEMS.map((item, index) => (
                          <div
                            key={item.label}
                            style={getSidebarItemAnimationStyle(index)}
                            className={cn(
                              'w-fit shrink-0 motion-safe:animate-page-header-mobile-sidebar-item-enter',
                              enterAnimationPlayStateClassName,
                            )}
                          >
                            <PageHeaderNavLink
                              segment={item.segment}
                              href={item.href}
                              variant="sidebar"
                              onClick={closeSidebar}
                            >
                              {item.label}
                            </PageHeaderNavLink>
                          </div>
                        ))}
                      </Box>

                      <div
                        style={getSidebarItemAnimationStyle(PAGE_HEADER_NAVIGATION_ITEMS.length)}
                        className={cn(
                          'w-full shrink-0 motion-safe:animate-page-header-mobile-sidebar-item-enter',
                          enterAnimationPlayStateClassName,
                        )}
                      >
                        {isLogin ? (
                          <Box className="border-outline-lower gap-010 pt-020 flex w-full items-center border-t">
                            <Avatar
                              className="size-[30px]"
                              alt={userName ? `${userName} 프로필` : '내 프로필'}
                            />
                            {userName ? (
                              <Text variant="subtitle-xs" className="text-text-medium">
                                {userName} 님
                              </Text>
                            ) : null}
                          </Box>
                        ) : (
                          <Box className="border-outline-lower gap-016 pt-020 flex w-full flex-col items-start border-t">
                            <Box as="p" className="flex flex-col">
                              <Text variant="body-xl" className="text-text-medium">
                                로그인하고 나에게 맞는 광고 채널을
                              </Text>
                              <Text variant="body-xl" className="text-text-medium">
                                추천받아 보세요!
                              </Text>
                            </Box>
                            <HeaderLoginButton />
                          </Box>
                        )}
                      </div>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
