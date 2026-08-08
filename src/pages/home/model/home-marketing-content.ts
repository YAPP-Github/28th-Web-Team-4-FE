export const HOME_PRODUCT_STEPS = [
  {
    eyebrow: '01',
    title: '서비스 상황을 알려주세요',
    description: '업종, 목표, 예산, 운영 경험을 기준으로 광고 채널 후보를 좁혀요.',
  },
  {
    eyebrow: '02',
    title: '맞춤 채널을 추천받아요',
    description: '네이버, 카카오, 메타, 유튜브 등 주요 채널을 적합도 순서로 보여줘요.',
  },
  {
    eyebrow: '03',
    title: '예상 성과를 비교해요',
    description: '노출, 클릭, 최소 예산, 과금 방식까지 한 화면에서 비교해요.',
  },
] as const;

export const HOME_FEATURES = [
  {
    title: '맞춤 채널 추천',
    description: '몇 가지 질문만으로 지금 서비스에 먼저 실험해 볼 채널을 찾아요.',
    href: '/recommend/onboarding/new',
    cta: '추천 시작',
  },
  {
    title: '전체 채널 비교',
    description: '광고 채널별 특징과 예상 지표를 같은 기준으로 나란히 확인해요.',
    href: '/compare',
    cta: '비교 보기',
  },
  {
    title: '예산 시뮬레이터',
    description: '선택한 채널 조합에서 예산별 예상 노출과 클릭을 미리 계산해요.',
    href: '/simulator',
    cta: '시뮬레이션',
  },
] as const;

export const HOME_STATS = [
  { label: '추천 후보', value: '8개' },
  { label: '비교 선택', value: '최대 3개' },
  { label: '예상 지표', value: '5종' },
] as const;
