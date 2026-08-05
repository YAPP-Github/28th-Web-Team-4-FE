'use client';

import { useState, type JSX } from 'react';
import { Drawer } from '@base-ui/react/drawer';
import { Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar';
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
  'focus-visible:outline-sys-primary-default -mr-3 flex size-11 cursor-pointer items-center justify-center rounded-[var(--radius-xxs)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2';

export function PageHeaderMobileSidebar({
  isLogin,
  userName,
}: PageHeaderMobileSidebarProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const closeSidebar = () => setOpen(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="down" disablePointerDismissal>
      <Drawer.Trigger aria-label="메뉴 열기" className={iconButtonClassName}>
        <MenuIcon className="size-020 text-icon-higher" strokeWidth={1.5} aria-hidden />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Viewport className="fixed inset-0 z-50 lg:hidden">
          <Drawer.Popup className="bg-surface-lowest flex h-full w-full [transform:translateY(var(--drawer-swipe-movement-y))] touch-auto flex-col outline-none">
            <Drawer.Content className="flex min-h-0 flex-1 flex-col">
              <Drawer.Title className="sr-only">전체 메뉴</Drawer.Title>

              <Box className="border-outline-low px-020 flex h-14 shrink-0 items-center justify-between border-b">
                <Link
                  href="/"
                  aria-label="chaesozip"
                  onClick={closeSidebar}
                  className="focus-visible:outline-sys-primary-default shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Logo type="s" alt="" />
                </Link>
                <Drawer.Close aria-label="메뉴 닫기" className={iconButtonClassName}>
                  <Box
                    as="span"
                    className="bg-surface-low size-020 flex items-center justify-center rounded-[var(--radius-xxs)]"
                  >
                    <X className="text-icon-higher size-3" strokeWidth={1.5} aria-hidden />
                  </Box>
                </Drawer.Close>
              </Box>

              <Box className="gap-020 p-020 flex min-h-0 flex-1 flex-col overflow-y-auto">
                <Box
                  as="nav"
                  aria-label="모바일 주요 메뉴"
                  className="gap-026 flex min-h-0 flex-1 flex-col items-start"
                >
                  {PAGE_HEADER_NAVIGATION_ITEMS.map((item) => (
                    <PageHeaderNavLink
                      key={item.label}
                      segment={item.segment}
                      href={item.href}
                      variant="sidebar"
                      onClick={closeSidebar}
                    >
                      {item.label}
                    </PageHeaderNavLink>
                  ))}
                </Box>

                {isLogin ? (
                  <Box className="border-outline-lower gap-010 pt-020 flex w-full shrink-0 items-center border-t">
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
                  <Box className="border-outline-lower gap-016 pt-020 flex w-full shrink-0 flex-col items-start border-t">
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
              </Box>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
