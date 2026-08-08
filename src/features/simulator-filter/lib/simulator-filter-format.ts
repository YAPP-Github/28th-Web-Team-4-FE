export function formatSimulatorBudget(amountInTenThousands: number): string {
  return `${amountInTenThousands.toLocaleString('ko-KR')}만 원`;
}

export function formatSimulatorDailyBudget(
  totalBudgetInTenThousands: number,
  days: number | null,
): string {
  if (!days) {
    return formatSimulatorBudget(0);
  }

  const dailyBudget = Math.round((totalBudgetInTenThousands / days) * 10) / 10;

  return `${dailyBudget.toLocaleString('ko-KR', {
    maximumFractionDigits: 1,
  })}만 원`;
}
