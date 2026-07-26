import {
  commitCustomBudgetInputValue,
  formatBudgetAmount,
  getCustomBudgetInputValue,
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
});
