import { redirect } from 'next/navigation';

import { SimulatorRecommendationSelectionApiPage } from '@/pages/simulator';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export { metadata } from '@/pages/simulator';

export default async function SimulatorRecommendationSelectionRoute() {
  if (!(await hasActiveAuthSession())) {
    redirect('/login');
  }

  return <SimulatorRecommendationSelectionApiPage />;
}
