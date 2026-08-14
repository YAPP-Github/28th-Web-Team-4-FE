import { MyPage } from '@/pages/mypage';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

export default async function MyPageRoute() {
  const isLoggedIn = await hasActiveAuthSession();

  return <MyPage isLoggedIn={isLoggedIn} />;
}
