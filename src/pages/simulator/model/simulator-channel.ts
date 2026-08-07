export type ChannelType = 'naver' | 'newscash' | 'meta';

export type ChannelMetric = {
  value: string;
  fillPercentage: number;
};

export type ChannelResult = {
  name: string;
  type: ChannelType;
  impressions: ChannelMetric;
  clicks: ChannelMetric;
  unavailable?: boolean;
};
