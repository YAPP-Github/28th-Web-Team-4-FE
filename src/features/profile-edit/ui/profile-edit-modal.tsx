'use client';

import { useState, type FormEvent, type JSX } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { UpdateProfileRequest, UserProfileResponse } from '@/shared/api/generated/types.gen';
import { updateProfile } from '@/features/profile-edit/api/update-profile';
import {
  PROFILE_OCCUPATION_OPTIONS,
  type ProfileOccupation,
} from '@/features/profile-edit/model/profile-edit-options';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
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
    <Box className="gap-008 flex w-full flex-col items-start">
      <Text as="label" htmlFor={htmlFor} variant="body-xl" className="text-text-medium">
        {label}
      </Text>
      {children}
    </Box>
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
        <form className="gap-026 flex w-full flex-col" onSubmit={handleSubmit}>
          <Box className="gap-020 flex w-full flex-col items-center">
            <Modal.Title render={<Text as="h2" variant="heading-xxl" />}>프로필 수정</Modal.Title>
            <Box className="bg-surface-lower gap-012 rounded-m px-016 py-012 flex w-full items-center">
              <Box className="gap-014 flex min-w-0 flex-1 items-center">
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
          </Box>
          <Box className="gap-010 flex h-12 w-full">
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
          </Box>
        </form>
      </Modal.Popup>
    </Modal.Portal>
  );
}
