'use client';

import type { JSX } from 'react';
import { Menu } from '@base-ui/react/menu';

import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export type PageHeaderAccountMenuProps = {
  userName?: string;
  onLogout?: () => void;
  isLogoutPending?: boolean;
  logoutError?: string;
};

export function PageHeaderAccountMenu({
  userName,
  onLogout,
  isLogoutPending = false,
  logoutError,
}: PageHeaderAccountMenuProps): JSX.Element {
  const avatarAlt = userName ? `${userName} 프로필` : '내 프로필';

  return (
    <Box className="gap-018 flex shrink-0 items-center">
      {userName ? (
        <Text variant="subtitle-xs" className="text-text-medium">
          {userName} 님
        </Text>
      ) : null}

      <Menu.Root>
        <Menu.Trigger
          aria-label="계정 메뉴 열기"
          className="focus-visible:outline-sys-primary-default data-popup-open:ring-outline-low flex size-9 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 data-popup-open:ring-4"
        >
          <Avatar alt={avatarAlt} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className="z-50 outline-none" side="bottom" align="end" sideOffset={10}>
            <Menu.Popup
              className={cn(
                'border-outline-default bg-surface-lowest w-[92px] overflow-hidden rounded-[var(--radius-s)] border outline-none',
                logoutError && 'w-[240px]',
              )}
            >
              <Menu.Item
                closeOnClick={false}
                nativeButton
                disabled={isLogoutPending}
                onClick={onLogout}
                render={
                  <Button
                    frame="button"
                    tone="stroke"
                    disabled={isLogoutPending}
                    className="data-highlighted:bg-surface-low px-016 h-[42px] w-full rounded-none border-0"
                  >
                    로그아웃
                  </Button>
                }
              />
              {logoutError ? (
                <p className="typo-body-sm text-sys-error-default px-012 py-008" role="alert">
                  {logoutError}
                </p>
              ) : null}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Box>
  );
}
