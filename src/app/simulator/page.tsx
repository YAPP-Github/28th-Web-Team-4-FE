import { SimulatorPage } from '@/pages/simulator';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export { metadata } from '@/pages/simulator';

type SimulatorRouteProps = {
  searchParams: Promise<{
    channelIds?: string | string[];
  }>;
};

function getSelectedChannelIds(channelIds: string | string[] | undefined): string[] {
  let values: string[];

  if (Array.isArray(channelIds)) {
    values = channelIds;
  } else if (channelIds) {
    values = [channelIds];
  } else {
    values = [];
  }

  return [...new Set(values.map((channelId) => channelId.trim()).filter(Boolean))];
}

export default async function SimulatorRoute({ searchParams }: SimulatorRouteProps) {
  const [isLogin, resolvedSearchParams] = await Promise.all([hasActiveAuthSession(), searchParams]);
  const selectedChannelIds = getSelectedChannelIds(resolvedSearchParams.channelIds);

  return (
    <SimulatorPage
      isLogin={isLogin}
      isChannelSelectionComplete={isLogin && selectedChannelIds.length === 3}
      selectedChannelIds={selectedChannelIds}
    />
  );
}
