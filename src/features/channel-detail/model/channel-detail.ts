export type ChannelProductRow = {
  id: string;
  name: string;
  budgetRange: string;
  expectedImpressions: string;
  ctr: string | null;
};

export type ChannelAudienceMetric = {
  label: string;
  value: string;
};

export type ChannelAudience = {
  primaryAgeBand: string;
  primaryGender: string;
  traits: string;
  metrics: ChannelAudienceMetric[];
};

export type ChannelDetail = {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  summary: {
    paragraphs: string[];
  };
  products: ChannelProductRow[];
  productsNote: string;
  audience: ChannelAudience;
  similarCases: string[];
};
