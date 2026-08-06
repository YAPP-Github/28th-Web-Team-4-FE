import { SimulatorPage } from '@/pages/simulator';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export default async function SimulatorRoute() {
  const isLogin = await hasActiveAuthSession();

  return <SimulatorPage isLogin={isLogin} />;
}
