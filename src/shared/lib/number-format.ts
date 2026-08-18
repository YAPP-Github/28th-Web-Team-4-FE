type NumberRange = {
  min: number;
  max: number;
};

const KOREAN_NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');

export function formatKoreanNumber(value: number): string {
  return KOREAN_NUMBER_FORMATTER.format(value);
}

export function formatWon(value: number): string {
  return `${formatKoreanNumber(value)}원`;
}

export function formatCountRange(range: NumberRange): string {
  return `${formatKoreanNumber(range.min)}~${formatKoreanNumber(range.max)}회`;
}
