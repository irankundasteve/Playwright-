import { Trend, BuyingSignal, Prediction, SentimentData } from './types';

export const mockTrends: Trend[] = [
  { id: '1', keyword: 'Sustainable Packaging', volume: 12500, growth: 45, sentiment: 0.8, source: 'Reddit', timestamp: '2024-03-20' },
  { id: '2', keyword: 'AI Personal Assistants', volume: 45000, growth: 120, sentiment: 0.6, source: 'Twitter', timestamp: '2024-03-20' },
  { id: '3', keyword: 'Plant-based Leather', volume: 8200, growth: 15, sentiment: 0.9, source: 'LinkedIn', timestamp: '2024-03-19' },
  { id: '4', keyword: 'Micro-SaaS for Creators', volume: 15600, growth: 65, sentiment: 0.7, source: 'Quora', timestamp: '2024-03-19' },
  { id: '5', keyword: 'Zero-waste Beauty', volume: 9400, growth: -5, sentiment: 0.4, source: 'YouTube', timestamp: '2024-03-18' },
];

export const mockSignals: BuyingSignal[] = [
  { id: 's1', text: "Looking for a reliable sustainable packaging supplier for my new e-commerce brand. Any recommendations?", intent: 'high', source: 'Reddit', category: 'E-commerce', timestamp: '2024-03-20' },
  { id: 's2', text: "Is there an AI tool that can manage my calendar and emails automatically? Willing to pay for a good one.", intent: 'high', source: 'Twitter', category: 'Productivity', timestamp: '2024-03-20' },
  { id: 's3', text: "Thinking about switching to plant-based leather for my next bag. Does it last long?", intent: 'medium', source: 'Quora', category: 'Fashion', timestamp: '2024-03-19' },
  { id: 's4', text: "Need a simple tool to track my affiliate links. Most options are too complex.", intent: 'high', source: 'Reddit', category: 'Marketing', timestamp: '2024-03-19' },
];

export const mockPredictions: Prediction[] = [
  { id: 'p1', topic: 'Hyper-local E-commerce', probability: 0.85, timeframe: '6-12 months', reasoning: 'Rising shipping costs and consumer desire for faster delivery are driving demand for local fulfillment centers.' },
  { id: 'p2', topic: 'Decentralized Social Media', probability: 0.65, timeframe: '12-24 months', reasoning: 'Growing concerns over data privacy and platform censorship are pushing users toward federated protocols.' },
  { id: 'p3', topic: 'AI-generated Fashion Design', probability: 0.75, timeframe: '3-6 months', reasoning: 'Fast fashion brands are already testing AI to predict and design trends in real-time.' },
];

export const mockSentiment: SentimentData[] = [
  { name: 'Sustainable Packaging', positive: 70, neutral: 20, negative: 10 },
  { name: 'AI Assistants', positive: 55, neutral: 30, negative: 15 },
  { name: 'Plant-based Leather', positive: 80, neutral: 15, negative: 5 },
  { name: 'Micro-SaaS', positive: 60, neutral: 35, negative: 5 },
];
