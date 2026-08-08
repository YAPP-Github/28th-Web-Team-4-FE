import type { JSX } from 'react';
import { Pencil } from 'lucide-react';

import { Avatar } from '@/shared/ui/avatar';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export function AuthenticatedProfileCard(): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="profile-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-l"
    >
      <Box className="flex w-full items-center justify-between">
        <Text as="h2" id="profile-title" variant="heading-lg" className="text-text-highest">
          내 정보
        </Text>
        <button
          type="button"
          aria-label="내 정보 수정"
          className="focus-visible:outline-sys-primary-default size-018 rounded-xxs flex cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Pencil aria-hidden="true" className="text-icon-low size-018" strokeWidth={1.6} />
        </button>
      </Box>
      <Box className="bg-surface-lower gap-012 rounded-m px-016 py-012 flex w-full items-center">
        <Box className="gap-012 flex min-w-0 flex-1 items-center">
          <Avatar className="size-048 hover:ring-0" alt="YAPP 프로필" />
          <Box className="flex h-[46px] min-w-0 flex-1 flex-col">
            <Text variant="heading-lg" className="text-text-highest">
              YAPP
            </Text>
            <Text variant="body-xl" className="text-text-low">
              Web4team@naver.com
            </Text>
          </Box>
        </Box>
      </Box>
      <Box className="gap-010 flex w-full flex-col">
        <Box className="gap-012 flex w-full items-center">
          <Text as="p" variant="subtitle-xxs" className="text-text-low w-036 shrink-0">
            회사
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-highest">
            YAPP
          </Text>
        </Box>
        <Box className="gap-012 flex w-full items-center">
          <Text as="p" variant="subtitle-xxs" className="text-text-low w-036 shrink-0">
            직무
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-highest">
            디자인
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
