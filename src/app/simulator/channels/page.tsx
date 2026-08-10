import { redirect } from 'next/navigation';

import { SimulatorChannelSelectionPage } from '@/pages/simulator-channel-selection';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export { metadata } from '@/pages/simulator';

export default async function SimulatorChannelSelectionRoute() {
  if (!(await hasActiveAuthSession())) {
    redirect('/login');
  }

  return <SimulatorChannelSelectionPage />;
}
