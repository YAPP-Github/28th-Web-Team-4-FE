'use client';

import { useEffect, type JSX } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { Placeholder } from '@/shared/ui/placeholder';

type RecommendOnboardingProcessingClientProps = {
  onboardingId: string;
};

export function RecommendOnboardingProcessingClient({
  onboardingId,
}: RecommendOnboardingProcessingClientProps): JSX.Element {
  const router = useRouter();
  useSuspenseQuery(
    getRecommendationsOptions({
      query: { onboardingId },
    }),
  );

  useEffect(() => {
    router.replace(`/recommend/${onboardingId}`);
  }, [onboardingId, router]);

  return (
    <main className="bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center">
      <Placeholder title="추천 결과로 이동하고 있어요" subtitle="채널 조회가 완료되었습니다" />
    </main>
  );
}
