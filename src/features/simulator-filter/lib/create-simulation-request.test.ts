import { createSimulationRequest } from './create-simulation-request';

describe('createSimulationRequest', () => {
  it('만원 단위 필터값을 API 요청 형식으로 변환한다', () => {
    expect(
      createSimulationRequest(
        {
          totalBudget: 25,
          period: 'two-to-three-weeks',
          channelBudgets: { 'channel-a': 10, 'channel-b': 5, 'channel-c': 0 },
        },
        ['channel-a', 'channel-b', 'channel-c'],
      ),
    ).toEqual({
      totalBudgetWon: 250_000,
      period: 'W2_3',
      allocations: [
        { channelId: 'channel-a', budgetWon: 100_000, allocationPct: 40 },
        { channelId: 'channel-b', budgetWon: 50_000, allocationPct: 20 },
        { channelId: 'channel-c', budgetWon: 0, allocationPct: 0 },
      ],
    });
  });
});
