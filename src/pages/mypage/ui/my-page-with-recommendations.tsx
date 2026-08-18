'use client';

import type { JSX } from 'react';

import { createSavedRecommendations } from '@/pages/mypage/model/my-page-content';
import { MyPage, type MyPageProps } from '@/pages/mypage/ui/my-page';
import { useMyRecommendations } from '@/shared/api/use-my-recommendations';

type MyPageWithRecommendationsProps = Omit<
  MyPageProps,
  'savedRecommendations' | 'savedRecommendationsLoading' | 'savedRecommendationsError'
>;

/** 마이페이지에서 로그인 사용자의 저장된 추천 결과를 API로 조회한다. */
export function MyPageWithRecommendations(props: MyPageWithRecommendationsProps): JSX.Element {
  const recommendationsQuery = useMyRecommendations({ enabled: props.isLoggedIn });
  const recommendations = recommendationsQuery.data?.data.content;

  return (
    <MyPage
      {...props}
      savedRecommendations={
        recommendations ? createSavedRecommendations(recommendations) : undefined
      }
      savedRecommendationsLoading={props.isLoggedIn === true && recommendationsQuery.isPending}
      savedRecommendationsError={props.isLoggedIn === true && recommendationsQuery.isError}
    />
  );
}
