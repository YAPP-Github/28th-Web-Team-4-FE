import { MyPage } from '@/pages/mypage';
import { MY_PAGE_ONBOARDING_DATA_FIXTURE } from '@/pages/mypage/model/my-page-preview-data';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

type MyPageRouteProps = {
  searchParams: Promise<{ preview?: string | string[] | undefined }>;
};

export default async function MyPageRoute({ searchParams }: MyPageRouteProps) {
  const [isLoggedIn, query] = await Promise.all([hasActiveAuthSession(), searchParams]);
  const isOnboardingDataPreview =
    process.env.NODE_ENV === 'development' && query.preview === 'onboarding-data';

  return (
    <MyPage
      isLoggedIn={isLoggedIn || isOnboardingDataPreview}
      adsCondition={isOnboardingDataPreview ? MY_PAGE_ONBOARDING_DATA_FIXTURE : undefined}
    />
  );
}
