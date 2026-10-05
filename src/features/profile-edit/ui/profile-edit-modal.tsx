'use client';

import { useState, type FormEvent, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { UpdateProfileRequest, UserProfileResponse } from '@/shared/api/generated/types.gen';
import { updateProfile } from '@/features/profile-edit/api/update-profile';
import {
  PROFILE_OCCUPATION_OPTIONS,
  type ProfileOccupation,
} from '@/features/profile-edit/model/profile-edit-options';
import { Flex } from '@/shared/ui/layout/flex';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { showToast, showWarningToast } from '@/shared/ui/toast';
import { Text } from '@/shared/ui/text';

const PROFILE_UPDATE_TOAST_ID = 'profile-update-success';
const PROFILE_UPDATE_TOAST_TIMEOUT = 3_000;

type ProfileEditModalProps = {
  profile: UserProfileResponse;
  onSaved: (profile: UserProfileResponse) => void;
};

function ProfileField({
  children,
  htmlFor,
  label,
}: {
  children: JSX.Element;
  htmlFor?: string;
  label: string;
}): JSX.Element {
  return (
    <Stack className="gap-008 w-full items-start">
      <Text as="label" htmlFor={htmlFor} variant="body-xl" className="text-text-medium">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

export function ProfileEditModal({ profile, onSaved }: ProfileEditModalProps): JSX.Element {
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [occupation, setOccupation] = useState<ProfileOccupation>(profile.occupation);
  const updateMutation = useMutation({ mutationFn: updateProfile });
  const isSaveDisabled = updateMutation.isPending || companyName.trim().length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (isSaveDisabled) {
      return;
    }

    const body: UpdateProfileRequest = {
      companyName: companyName.trim(),
      occupation,
    };

    updateMutation.mutate(body, {
      onSuccess: (updatedProfile) => {
        showToast({
          id: PROFILE_UPDATE_TOAST_ID,
          description: '저장했어요',
          timeout: PROFILE_UPDATE_TOAST_TIMEOUT,
          type: 'success',
        });
        onSaved(updatedProfile);
      },
      onError: (error) => {
        showWarningToast(
          getApiErrorMessage(error, '프로필을 저장하지 못했어요. 다시 시도해 주세요.'),
          {
            id: 'profile-update-error',
          },
        );
      },
    });
  };

  return (
    <Modal.Portal>
      <Modal.Backdrop />
      <Modal.Popup className="gap-026 px-030 pb-024 pt-030 w-[568px] items-center">
        <Stack as="form" className="gap-026 w-full" onSubmit={handleSubmit}>
          <VStack className="gap-020 w-full">
            <Modal.Title render={<Text as="h2" variant="heading-xxl" />}>프로필 수정</Modal.Title>
            <HStack className="bg-surface-lower gap-012 rounded-m px-016 py-012 w-full">
              <HStack className="gap-014 min-w-0 flex-1">
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
            <ProfileField htmlFor="profile-company" label="회사">
              <Input
                frame="input"
                id="profile-company"
                aria-label="회사"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="h-[46px]"
                maxLength={50}
                required
              />
            </ProfileField>
            <ProfileField label="직무">
              <Dropdown
                options={PROFILE_OCCUPATION_OPTIONS}
                placeholder="직무를 선택해 주세요"
                triggerAriaLabel="직무"
                value={occupation}
                onValueChange={(value) => {
                  if (value) {
                    setOccupation(value);
                  }
                }}
              />
            </ProfileField>
          </VStack>
          <Flex className="gap-010 h-12 w-full">
            <Modal.CloseButton
              frame="button"
              tone="stroke"
              className="h-12 flex-1"
              disabled={updateMutation.isPending}
            >
              취소
            </Modal.CloseButton>
            <Button
              frame="cta"
              tone="secondary"
              size="m"
              type="submit"
              className="h-12 flex-1"
              disabled={isSaveDisabled}
            >
              저장하기
            </Button>
          </Flex>
        </Stack>
      </Modal.Popup>
    </Modal.Portal>
  );
}
