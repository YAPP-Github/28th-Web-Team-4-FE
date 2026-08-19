export type ChannelProductRow = {
  id: string;
  name: string;
  budgetRange: string;
  expectedImpressions: string;
  expectedClicks: string;
  isExecutable: boolean | null;
};

export type ChannelAudienceMetric = {
  label: string;
  value: string;
};

export type ChannelAudience = {
  primaryAgeBand: string;
  primaryGender: string;
  metrics: ChannelAudienceMetric[];
  traits: string;
};

export type ChannelRecommendationReason = {
  category: string;
  objective: string;
  objectiveWithParticle: string;
  budget: string;
  rationale: string | null;
};

export type ChannelDetail = {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  summary: {
    keywords: string[];
    paragraphs: string[];
    recommendationReason: ChannelRecommendationReason | null;
  };
  products: ChannelProductRow[];
  productsNote: string;
  audience: ChannelAudience;
  similarCases: string[];
};
