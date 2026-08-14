'use client';

import { useMutation } from '@tanstack/react-query';

import { saveRecommendationMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

export function useSaveRecommendation() {
  return useMutation(saveRecommendationMutation());
}
