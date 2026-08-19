'use client';

import { useMutation } from '@tanstack/react-query';

import { saveChannelComparisonMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

export function useSaveChannelComparison() {
  return useMutation(saveChannelComparisonMutation());
}
