import {
  getInitialRecommendOnboardingServiceName,
  RecommendOnboardingPage,
} from '@/pages/recommend-onboarding';

type RecommendOnboardingNewRouteProps = {
  searchParams: Promise<{
    serviceName?: string | string[] | undefined;
  }>;
};

export default async function RecommendOnboardingNewRoute({
  searchParams,
}: RecommendOnboardingNewRouteProps) {
  const resolvedSearchParams = await searchParams;
  const initialServiceName = getInitialRecommendOnboardingServiceName(resolvedSearchParams);

  return <RecommendOnboardingPage initialServiceName={initialServiceName} />;
}
