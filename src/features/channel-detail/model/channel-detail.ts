export type ChannelProductRow = {
  id: string;
  name: string;
  budgetRange: string;
  expectedImpressions: string;
  expectedClicks: string;
};

export type ChannelAudience = {
  primaryAgeBand: string;
  primaryGender: string;
  userScale: string;
  dailyActiveUsers: string;
  traits: string;
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
