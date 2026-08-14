const CATEGORY_LABELS = {
  GAME: '게임',
  ENTERTAINMENT: '엔터테인먼트',
  EDUCATION: '교육',
  SOCIAL_COMMUNITY: '소셜·커뮤니티',
  LIFESTYLE: '라이프 스타일',
  HEALTH_FITNESS: '건강·피트니스',
  FOOD_BEVERAGE: '음식·음료',
  SHOPPING_COMMERCE: '쇼핑·커머스',
  FINANCE_FINTECH: '금융·핀테크',
  BUSINESS_B2B: '비즈니스·B2B',
  MEDICAL_HEALTHCARE: '의료·헬스케어',
  TRAVEL_ACCOMMODATION: '여행·숙박',
  MUSIC_MEDIA: '음악·미디어',
  PRODUCTIVITY_UTILITY: '생산성·유틸리티',
  SPORTS: '스포츠',
  NEWS_INFORMATION: '뉴스·정보',
  OTHER: '기타',
  OTHERS: '기타',
} as const;

export function getRecommendationCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? CATEGORY_LABELS.OTHER;
}

export { CATEGORY_LABELS };
