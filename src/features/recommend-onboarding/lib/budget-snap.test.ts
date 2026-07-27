import {
  clampBudgetMaxAmount,
  clampBudgetMinAmount,
  commitBudgetInputValue,
  commitCustomBudgetInputValue,
  formatBudgetAmount,
  formatBudgetRange,
  getBudgetInputValue,
  getCustomBudgetInputValue,
  isBudgetRangeEmpty,
  snapBudgetAmount,
  snapCustomBudgetAmount,
} from './budget-snap';

describe('budget snap', () => {
  it('입력값을 가장 가까운 예산 단계로 보정한다', () => {
    expect(snapCustomBudgetAmount(0)).toBe(0);
    expect(snapCustomBudgetAmount(15)).toBe(0);
    expect(snapCustomBudgetAmount(35)).toBe(500000);
    expect(snapCustomBudgetAmount(80)).toBe(500000);
    expect(snapCustomBudgetAmount(210)).toBe(2000000);
    expect(snapCustomBudgetAmount(300)).toBe(2000000);
    expect(snapCustomBudgetAmount(350)).toBe(2000000);
    expect(snapCustomBudgetAmount(900)).toBe(10000000);
  });

  it('두 예산 단계와의 거리가 같으면 낮은 값을 선택한다', () => {
    expect(snapCustomBudgetAmount(25)).toBe(0);
    expect(snapCustomBudgetAmount(350)).toBe(2000000);
  });

  it('안전한 정수가 아니면 0원으로 보정한다', () => {
    expect(snapCustomBudgetAmount(Number.NaN)).toBe(0);
    expect(snapCustomBudgetAmount(10.5)).toBe(0);
  });

  it('빈 입력 확정 시 0원으로 보정한다', () => {
    expect(commitCustomBudgetInputValue(null)).toEqual({ amount: 0, inputValue: 0 });
  });

  it('확정 금액을 입력 UI의 만원 단위 값으로 변환한다', () => {
    expect(getCustomBudgetInputValue(5000000)).toBe(500);
  });

  it('확정 금액을 한국어 금액 label로 포맷한다', () => {
    expect(formatBudgetAmount(0)).toBe('0원');
    expect(formatBudgetAmount(500000)).toBe('50만 원');
    expect(formatBudgetAmount(10000000)).toBe('1,000만 원');
  });

  it('범위 input의 소수 값을 가장 가까운 예산 단계로 보정한다', () => {
    expect(snapBudgetAmount(35.5)).toBe(500000);
    expect(snapBudgetAmount(349.9)).toBe(2000000);
    expect(snapBudgetAmount(350.1)).toBe(5000000);
  });

  it('범위 input이 두 단계와 같은 거리면 낮은 값을 선택한다', () => {
    expect(snapBudgetAmount(25)).toBe(0);
    expect(snapBudgetAmount(350)).toBe(2000000);
  });

  it('범위 input의 비정상 숫자와 빈 값을 경계 금액으로 확정한다', () => {
    expect(snapBudgetAmount(Number.NaN)).toBe(0);
    expect(snapBudgetAmount(Number.NEGATIVE_INFINITY)).toBe(0);
    expect(snapBudgetAmount(Number.POSITIVE_INFINITY)).toBe(10000000);
    expect(commitBudgetInputValue(null)).toEqual({ amount: 0, inputValue: 0 });
  });

  it('범위 확정 금액을 만원 단위 input 값으로 변환한다', () => {
    expect(getBudgetInputValue(5000000)).toBe(500);
  });

  it('확정된 최소·최대 예산을 한국어 범위 label로 포맷한다', () => {
    expect(formatBudgetRange({ minAmount: 500000, maxAmount: 5000000 })).toBe('50만 원~500만 원');
    expect(formatBudgetRange({ minAmount: 2000000, maxAmount: 2000000 })).toBe('200만 원');
  });

  it('최소·최대 예산이 모두 0원이면 미입력 범위로 판단한다', () => {
    expect(isBudgetRangeEmpty({ minAmount: 0, maxAmount: 0 })).toBe(true);
    expect(isBudgetRangeEmpty({ minAmount: 0, maxAmount: 500000 })).toBe(false);
  });

  it('최소·최대 예산이 서로의 경계를 넘지 않도록 보정한다', () => {
    expect(clampBudgetMinAmount(5000000, 2000000)).toBe(2000000);
    expect(clampBudgetMinAmount(500000, 2000000)).toBe(500000);
    expect(clampBudgetMaxAmount(500000, 2000000)).toBe(2000000);
    expect(clampBudgetMaxAmount(5000000, 2000000)).toBe(5000000);
  });
});
