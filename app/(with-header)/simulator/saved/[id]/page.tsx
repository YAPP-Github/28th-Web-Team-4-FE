import { SimulatorSavedResultPage } from '@/pages/simulator';

export { nonIndexableMetadata as metadata } from '@/app/config/search-metadata';

type SavedSimulatorResultRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedSimulatorResultRoute({
  params,
}: SavedSimulatorResultRouteProps) {
  const { id } = await params;

  return <SimulatorSavedResultPage simulationId={id} />;
}
