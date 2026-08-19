'use client';

import { useMutation } from '@tanstack/react-query';

import { updateMyOnboardingTagMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

export function useUpdateMyOnboardingTag() {
  return useMutation(updateMyOnboardingTagMutation());
}
