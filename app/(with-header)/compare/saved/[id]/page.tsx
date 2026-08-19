import { CompareSavedResultPage } from '@/pages/compare';

export { nonIndexableMetadata as metadata } from '@/app/config/search-metadata';

type SavedCompareResultRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedCompareResultRoute({ params }: SavedCompareResultRouteProps) {
  const { id } = await params;

  return <CompareSavedResultPage comparisonId={id} />;
}
