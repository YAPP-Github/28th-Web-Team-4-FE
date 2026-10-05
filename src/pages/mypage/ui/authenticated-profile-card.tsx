'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, RefreshCw } from 'lucide-react';

import { ProfileEditModal, PROFILE_OCCUPATION_LABELS } from '@/features/profile-edit';
import type { UserProfileResponse } from '@/shared/api/generated/types.gen';
import { myProfileQueryKey } from '@/shared/lib/query-keys';
import { useMyProfile } from '@/pages/mypage/api/use-my-profile';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Center } from '@/shared/ui/layout/center';
import { HStack } from '@/shared/ui/layout/h-stack';
import { JustifyBetween } from '@/shared/ui/layout/justify-between';
import { Stack } from '@/shared/ui/layout/stack';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

function ProfileCardFrame({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Stack
      as="section"
      aria-labelledby="profile-title"
      className="bg-surface-lowest gap-018 px-030 py-024 w-full rounded-[var(--radius-l)]"
    >
      {children}
    </Stack>
  );
}

function ProfileCardHeader({
  disabled = false,
  onEdit,
}: {
  disabled?: boolean;
  onEdit?: () => void;
}): JSX.Element {
  return (
    <JustifyBetween className="w-full items-center">
      <Text as="h2" id="profile-title" variant="heading-lg" className="text-text-highest">
        내 정보
      </Text>
      <Center
        as="button"
        type="button"
        aria-label="내 정보 수정"
        className="focus-visible:outline-sys-primary-default size-018 rounded-xxs cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={onEdit}
      >
        <Pencil aria-hidden="true" className="text-icon-low size-018" strokeWidth={1.6} />
      </Center>
    </JustifyBetween>
  );
}

function ProfileCardLoading(): JSX.Element {
  return (
    <ProfileCardFrame>
      <ProfileCardHeader disabled />
      <Stack
        role="status"
        aria-label="내 정보를 불러오고 있어요"
        data-testid="my-profile-skeleton"
        className="gap-018 w-full"
      >
        <HStack className="bg-surface-lower rounded-m px-016 py-012 h-072 w-full">
          <HStack className="gap-014 h-048 w-full">
            <Avatar className="size-048 hover:ring-0" alt="" />
            <Stack className="h-[46px] min-w-0 flex-1">
              <HStack className="h-026 w-full">
                <Skeleton className="h-020 w-[76px] rounded-[var(--radius-xxs)]" />
              </HStack>
              <HStack className="h-020 w-full">
                <Skeleton className="h-010 w-[130px] rounded-full" />
              </HStack>
            </Stack>
          </HStack>
        </HStack>
        <Stack className="gap-010 w-full">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </Stack>
      </Stack>
    </ProfileCardFrame>
  );
}

function ProfileFieldSkeleton(): JSX.Element {
  return (
    <HStack className="gap-012 h-022 w-full">
      <HStack className="h-022 w-036 shrink-0">
        <Skeleton className="h-010 w-[24px] rounded-full" />
      </HStack>
      <HStack className="h-022 min-w-0 flex-1">
        <Skeleton className="h-010 w-[50px] rounded-full" />
      </HStack>
    </HStack>
  );
}

function ProfileCardError({ onRetry }: { onRetry: () => void }): JSX.Element {
  return (
    <ProfileCardFrame>
      <ProfileCardHeader disabled />
      <Stack
        role="alert"
        className="bg-surface-lower gap-012 rounded-m px-016 py-020 w-full items-start"
      >
        <Text variant="body-xl" className="text-text-low">
          내 정보를 불러오지 못했어요
        </Text>
        <Button
          frame="button"
          tone="secondary"
          size="s"
          leftIcon={<RefreshCw aria-hidden="true" className="size-016" />}
          onClick={onRetry}
        >
          다시 시도
        </Button>
      </Stack>
    </ProfileCardFrame>
  );
}

function ProfileCardContent({
  onEdit,
  profile,
}: {
  onEdit: () => void;
  profile: UserProfileResponse;
}): JSX.Element {
  return (
    <ProfileCardFrame>
      <ProfileCardHeader onEdit={onEdit} />
      <HStack className="bg-surface-lower gap-012 rounded-m px-016 py-012 w-full">
        <HStack className="gap-012 min-w-0 flex-1">
          <Avatar className="size-048 hover:ring-0" alt={`${profile.nickname} 프로필`} />
          <Stack className="h-[46px] min-w-0 flex-1">
            <Text variant="heading-lg" className="text-text-highest">
              {profile.nickname}
            </Text>
            <Text variant="body-xl" className="text-text-low">
              {profile.email}
            </Text>
          </Stack>
        </HStack>
      </HStack>
      <Stack className="gap-010 w-full">
        <HStack className="gap-012 w-full">
          <Text as="p" variant="subtitle-xxs" className="text-text-low w-036 shrink-0">
            회사
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-highest">
            {profile.companyName}
          </Text>
        </HStack>
        <HStack className="gap-012 w-full">
          <Text as="p" variant="subtitle-xxs" className="text-text-low w-036 shrink-0">
            직무
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-highest">
            {PROFILE_OCCUPATION_LABELS[profile.occupation]}
          </Text>
        </HStack>
      </Stack>
    </ProfileCardFrame>
  );
}

export function AuthenticatedProfileCard(): JSX.Element {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const profileQuery = useMyProfile();

  if (profileQuery.isPending) {
    return <ProfileCardLoading />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return <ProfileCardError onRetry={() => void profileQuery.refetch()} />;
  }

  const handleSaved = (profile: UserProfileResponse): void => {
    queryClient.setQueryData(myProfileQueryKey, profile);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <ProfileCardContent profile={profileQuery.data} onEdit={() => setIsEditModalOpen(true)} />
      {isEditModalOpen ? (
        <Modal.Root open onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
          <ProfileEditModal profile={profileQuery.data} onSaved={handleSaved} />
        </Modal.Root>
      ) : null}
    </>
  );
}
