'use client';

import { type JSX } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

type RecommendOnboardingProcessingClientProps = {
  onboardingId: string;
};

export function RecommendOnboardingProcessingClient({
  onboardingId,
}: RecommendOnboardingProcessingClientProps): JSX.Element {
  useSuspenseQuery(
    getRecommendationsOptions({
      query: { onboardingId },
    }),
  );

  redirect(`/recommend/${onboardingId}`);
}
