import type { MyAdsCondition } from './my-page-content';

/** 개발 환경에서 마이페이지의 온보딩 데이터 상태를 확인하기 위한 fixture. */
export const MY_PAGE_ONBOARDING_DATA_FIXTURE = {
  tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
} as const satisfies MyAdsCondition;
