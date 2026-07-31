import {
  getBudgetAmountByStepIndex,
  getBudgetRangeByStepIndexList,
  getBudgetSliderValue,
  getKeyboardBudgetSliderValue,
  snapBudgetSliderValue,
  toBudgetSliderValue,
} from './budget-slider';

describe('budget slider', () => {
  it('확정 예산 범위를 Slider 단계 index로 변환한다', () => {
    expect(getBudgetSliderValue({ minAmount: 500000, maxAmount: 5000000 })).toEqual([1, 3]);
  });

  it('드래그 중 연속 위치를 보존하고 두 Thumb의 순서를 맞춘다', () => {
    expect(toBudgetSliderValue([3.4, 0.6])).toEqual([0.6, 3.4]);
    expect(toBudgetSliderValue([Number.NaN, 8])).toEqual([0, 4]);
  });

  it('드래그 종료 시 가장 가까운 단계로 스냅하고 동일 거리면 낮은 단계를 선택한다', () => {
    expect(snapBudgetSliderValue([0.5, 2.6])).toEqual([0, 3]);
    expect(snapBudgetSliderValue([1.6, 3.5])).toEqual([2, 3]);
  });

  it('정수 단계 index를 확정 예산 범위로 변환한다', () => {
    expect(getBudgetRangeByStepIndexList([1, 4])).toEqual({
      minAmount: 500000,
      maxAmount: 10000000,
    });
  });

  it('방향키는 한 단계씩 이동하고 두 Thumb이 서로를 넘지 않는다', () => {
    expect(getKeyboardBudgetSliderValue([1, 3], [1.1, 3], 0, 'ArrowRight')).toEqual([2, 3]);
    expect(getKeyboardBudgetSliderValue([1, 3], [1, 2.9], 1, 'ArrowLeft')).toEqual([1, 2]);
    expect(getKeyboardBudgetSliderValue([3, 3], [3.1, 3], 0, 'ArrowRight')).toEqual([3, 3]);
  });

  it('Home과 End는 활성 Thumb을 허용 범위 끝으로 이동한다', () => {
    expect(getKeyboardBudgetSliderValue([1, 3], [0, 3], 0, 'Home')).toEqual([0, 3]);
    expect(getKeyboardBudgetSliderValue([1, 3], [1, 4], 1, 'End')).toEqual([1, 4]);
  });

  it('단계 index에 해당하는 원 단위 예산을 반환한다', () => {
    expect(getBudgetAmountByStepIndex(2)).toBe(2000000);
  });
});
