export type RecommendOnboardingNewSearchParams = {
  serviceName?: string | string[] | undefined;
};

export function getInitialRecommendOnboardingServiceName(
  searchParams: RecommendOnboardingNewSearchParams,
): string | undefined {
  const rawServiceName = searchParams.serviceName;
  const serviceNameList = Array.isArray(rawServiceName) ? rawServiceName : [rawServiceName];

  return serviceNameList
    .map((serviceName) => serviceName?.trim() ?? '')
    .find((serviceName) => serviceName.length > 0);
}
