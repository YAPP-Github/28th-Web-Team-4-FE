import { SavedResultsPage } from '@/pages/mypage';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export default async function SavedResultsRoute() {
  const isLoggedIn = await hasActiveAuthSession();

  return <SavedResultsPage isLoggedIn={isLoggedIn} />;
}
