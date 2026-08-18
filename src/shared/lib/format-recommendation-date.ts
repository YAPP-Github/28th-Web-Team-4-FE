/** 추천 결과 생성 시각을 마이페이지·시뮬레이터 공통 표시 형식으로 변환한다. */
export function formatRecommendationDate(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const partValues = new Map(parts.map(({ type, value }) => [type, value]));

  return [partValues.get('year'), partValues.get('month'), partValues.get('day')].join('.');
}
