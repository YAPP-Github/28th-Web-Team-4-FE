import { redirect } from 'next/navigation';

import { SimulatorChannelSelectionPage } from '@/pages/simulator-channel-selection';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export { metadata } from '@/pages/simulator';

type SimulatorChannelSelectionRouteProps = {
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

export default async function SimulatorChannelSelectionRoute({
  searchParams,
}: SimulatorChannelSelectionRouteProps) {
  if (!(await hasActiveAuthSession())) {
    redirect('/login');
  }

  const { channelIds } = await searchParams;

  return <SimulatorChannelSelectionPage existingChannelIds={getSelectedChannelIds(channelIds)} />;
}
