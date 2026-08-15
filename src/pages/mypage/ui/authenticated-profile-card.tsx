'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, RefreshCw } from 'lucide-react';

import { ProfileEditModal, PROFILE_OCCUPATION_LABELS } from '@/features/profile-edit';
import type { UserProfileResponse } from '@/shared/api/generated/types.gen';
import { myProfileQueryKey, useMyProfile } from '@/pages/mypage/api/use-my-profile';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Skeleton } from '@/shared/ui/skeleton';
import { Text } from '@/shared/ui/text';

function ProfileCardFrame({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="profile-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-[var(--radius-l)]"
    >
      {children}
    </Box>
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
    <Box className="flex w-full items-center justify-between">
      <Text as="h2" id="profile-title" variant="heading-lg" className="text-text-highest">
        내 정보
      </Text>
      <button
        type="button"
        aria-label="내 정보 수정"
        className="focus-visible:outline-sys-primary-default size-018 rounded-xxs flex cursor-pointer items-center justify-center outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={onEdit}
      >
        <Pencil aria-hidden="true" className="text-icon-low size-018" strokeWidth={1.6} />
      </button>
    </Box>
  );
}

function ProfileCardLoading(): JSX.Element {
  return (
    <ProfileCardFrame>
      <ProfileCardHeader disabled />
      <Box
        role="status"
        aria-label="내 정보를 불러오고 있어요"
        data-testid="my-profile-skeleton"
        className="gap-018 flex w-full flex-col"
      >
        <Box className="bg-surface-lower rounded-m px-016 py-012 h-072 flex w-full items-center">
          <Box className="gap-014 h-048 flex w-full items-center">
            <Avatar className="size-048 hover:ring-0" alt="" />
            <Box className="flex h-[46px] min-w-0 flex-1 flex-col">
              <Box className="h-026 flex w-full items-center">
                <Skeleton className="h-020 w-[76px] rounded-[var(--radius-xxs)]" />
              </Box>
              <Box className="h-020 flex w-full items-center">
                <Skeleton className="h-010 w-[130px] rounded-full" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="gap-010 flex w-full flex-col">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </Box>
      </Box>
    </ProfileCardFrame>
  );
}

function ProfileFieldSkeleton(): JSX.Element {
  return (
    <Box className="gap-012 h-022 flex w-full items-center">
      <Box className="h-022 w-036 flex shrink-0 items-center">
        <Skeleton className="h-010 w-[24px] rounded-full" />
      </Box>
      <Box className="h-022 flex min-w-0 flex-1 items-center">
        <Skeleton className="h-010 w-[50px] rounded-full" />
      </Box>
    </Box>
  );
}

function ProfileCardError({ onRetry }: { onRetry: () => void }): JSX.Element {
  return (
    <ProfileCardFrame>
      <ProfileCardHeader disabled />
      <Box
        role="alert"
        className="bg-surface-lower gap-012 rounded-m px-016 py-020 flex w-full flex-col items-start"
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
      </Box>
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
      <Box className="bg-surface-lower gap-012 rounded-m px-016 py-012 flex w-full items-center">
        <Box className="gap-012 flex min-w-0 flex-1 items-center">
          <Avatar className="size-048 hover:ring-0" alt={`${profile.nickname} 프로필`} />
          <Box className="flex h-[46px] min-w-0 flex-1 flex-col">
            <Text variant="heading-lg" className="text-text-highest">
              {profile.nickname}
            </Text>
            <Text variant="body-xl" className="text-text-low">
              {profile.email}
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
            {profile.companyName}
          </Text>
        </Box>
        <Box className="gap-012 flex w-full items-center">
          <Text as="p" variant="subtitle-xxs" className="text-text-low w-036 shrink-0">
            직무
          </Text>
          <Text as="p" variant="subtitle-xxs" className="text-text-highest">
            {PROFILE_OCCUPATION_LABELS[profile.occupation]}
          </Text>
        </Box>
      </Box>
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
