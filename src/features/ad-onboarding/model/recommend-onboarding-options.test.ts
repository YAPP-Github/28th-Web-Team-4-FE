import { getAvailableAdGoalOptionList } from './recommend-onboarding-options';

const DEFAULT_AD_GOAL_ID_LIST = [
  'BRAND_AWARENESS',
  'VIDEO_VIRAL',
  'TRAFFIC',
  'LEAD_GENERATION',
  'PURCHASE_CONVERSION',
];

const APP_AD_GOAL_ID_LIST = [...DEFAULT_AD_GOAL_ID_LIST, 'APP_INSTALL', 'IN_APP_ACTION'];

describe('getAvailableAdGoalOptionList', () => {
  it.each(['WEB_SERVICE', 'OTHER', undefined] as const)(
    '%s 서비스 형태에서는 기본 광고 목표를 Figma 순서대로 반환한다',
    (serviceType) => {
      expect(getAvailableAdGoalOptionList(serviceType).map((option) => option.value)).toEqual(
        DEFAULT_AD_GOAL_ID_LIST,
      );
    },
  );

  it.each(['MOBILE_APP', 'APP_AND_WEB'] as const)(
    '%s 서비스 형태에서는 앱 전용 목표를 포함해 Figma 순서대로 반환한다',
    (serviceType) => {
      expect(getAvailableAdGoalOptionList(serviceType).map((option) => option.value)).toEqual(
        APP_AD_GOAL_ID_LIST,
      );
    },
  );
});
