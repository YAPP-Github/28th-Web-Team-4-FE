/**
 * 예산 input이 blur로 확정되기 전까지 유지하는 화면 입력 상태를 정의한다.
 */

/** 만원 단위 최소·최대 입력값. 빈 input은 null로 보존한다. */
export type BudgetInputRange = {
  minInputValue: number | null;
  maxInputValue: number | null;
};
