export interface Trend {
  id: string;
  keyword: string;
  volume: number;
  growth: number;
  sentiment: number; // -1 to 1
  source: string;
  timestamp: string;
}

export interface BuyingSignal {
  id: string;
  text: string;
  intent: 'high' | 'medium' | 'low';
  source: string;
  category: string;
  timestamp: string;
}

export interface Prediction {
  id: string;
  topic: string;
  probability: number;
  timeframe: string;
  reasoning: string;
}

export interface SentimentData {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
}
