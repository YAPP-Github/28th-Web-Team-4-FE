import {
  getInitialRecommendOnboardingServiceName,
  RecommendOnboardingPage,
  type RecommendOnboardingNewSearchParams,
} from '@/pages/recommend-onboarding';

type RecommendRouteProps = {
  searchParams: Promise<RecommendOnboardingNewSearchParams>;
};

export default async function RecommendRoute({ searchParams }: RecommendRouteProps) {
  const resolvedSearchParams = await searchParams;
  const initialServiceName = getInitialRecommendOnboardingServiceName(resolvedSearchParams);

  return <RecommendOnboardingPage initialServiceName={initialServiceName} />;
}
