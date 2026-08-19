import { RecommendSavedResultPage } from '@/pages/recommend-result';

export { nonIndexableMetadata as metadata } from '@/app/config/search-metadata';

type SavedRecommendResultRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedRecommendResultRoute({
  params,
}: SavedRecommendResultRouteProps) {
  const { id } = await params;

  return <RecommendSavedResultPage recommendationId={id} />;
}
