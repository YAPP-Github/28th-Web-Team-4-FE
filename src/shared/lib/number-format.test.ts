import { formatCountRange, formatKoreanNumber, formatWon } from './number-format';

describe('number format', () => {
  it('숫자를 한국어 자릿수 구분 형식으로 표시한다', () => {
    expect(formatKoreanNumber(123_456)).toBe('123,456');
  });

  it('원 단위 금액을 축약하지 않고 표시한다', () => {
    expect(formatWon(200_000)).toBe('200,000원');
  });

  it('최소·최대 횟수 범위를 표시한다', () => {
    expect(formatCountRange({ min: 12_000, max: 18_000 })).toBe('12,000~18,000회');
  });
});
