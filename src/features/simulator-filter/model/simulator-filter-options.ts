export const SIMULATOR_FILTER_CHANNELS = [
  { type: 'naver', name: '네이버 검색 광고' },
  { type: 'newscash', name: '뉴스캐시' },
  { type: 'meta', name: '메타 광고' },
] as const;

export type SimulatorFilterChannelType = (typeof SIMULATOR_FILTER_CHANNELS)[number]['type'];

export const FILTER_PERIOD_OPTIONS = [
  { value: 'one-week', label: '1주 이하', days: 7 },
  { value: 'two-to-three-weeks', label: '2~3주', days: 21 },
  { value: 'one-month', label: '1개월', days: 30 },
  { value: 'two-to-three-months', label: '2~3개월', days: 75 },
  { value: 'three-months-or-more', label: '3개월 이상', days: 90 },
] as const;

export type SimulatorFilterPeriodValue = (typeof FILTER_PERIOD_OPTIONS)[number]['value'];

export type SimulatorFilterState = {
  totalBudget: number;
  period: SimulatorFilterPeriodValue | null;
  channelBudgets: Record<SimulatorFilterChannelType, number>;
};

export const INITIAL_SIMULATOR_FILTER_STATE: SimulatorFilterState = {
  totalBudget: 10,
  period: null,
  channelBudgets: {
    naver: 0,
    newscash: 0,
    meta: 0,
  },
};

export const SIMULATOR_FILTER_TOTAL_BUDGET_MIN = 10;
export const SIMULATOR_FILTER_TOTAL_BUDGET_MAX = 1000;
