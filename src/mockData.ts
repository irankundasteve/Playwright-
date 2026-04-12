import { Trend, BuyingSignal, Prediction, SentimentData } from './types';

// Generate 50+ trends
export const mockTrends: Trend[] = [
  { id: '1', keyword: 'Sustainable Packaging', volume: 125000, growth: 45, sentiment: 0.8, source: 'Reddit', timestamp: '2024-03-20' },
  { id: '2', keyword: 'AI Personal Assistants', volume: 450000, growth: 120, sentiment: 0.6, source: 'Twitter', timestamp: '2024-03-20' },
  { id: '3', keyword: 'Plant-based Leather', volume: 82000, growth: 15, sentiment: 0.9, source: 'LinkedIn', timestamp: '2024-03-19' },
  { id: '4', keyword: 'Micro-SaaS for Creators', volume: 156000, growth: 65, sentiment: 0.7, source: 'Quora', timestamp: '2024-03-19' },
  { id: '5', keyword: 'Zero-waste Beauty', volume: 94000, growth: -5, sentiment: 0.4, source: 'YouTube', timestamp: '2024-03-18' },
  { id: '6', keyword: 'Vertical Farming Tech', volume: 42000, growth: 88, sentiment: 0.85, source: 'Reddit', timestamp: '2024-03-18' },
  { id: '7', keyword: 'Remote Work Wellness', volume: 210000, growth: 30, sentiment: 0.5, source: 'Twitter', timestamp: '2024-03-17' },
  { id: '8', keyword: 'EdTech Gamification', volume: 115000, growth: 55, sentiment: 0.75, source: 'LinkedIn', timestamp: '2024-03-17' },
  { id: '9', keyword: 'Carbon Capture Solutions', volume: 35000, growth: 200, sentiment: 0.92, source: 'Reddit', timestamp: '2024-03-16' },
  { id: '10', keyword: 'No-code AI Builders', volume: 180000, growth: 110, sentiment: 0.68, source: 'Twitter', timestamp: '2024-03-16' },
  { id: '11', keyword: 'Subscription Box Fatigue', volume: 65000, growth: -15, sentiment: 0.3, source: 'Reddit', timestamp: '2024-03-15' },
  { id: '12', keyword: 'Direct-to-Consumer Coffee', volume: 92000, growth: 25, sentiment: 0.82, source: 'Instagram', timestamp: '2024-03-15' },
  { id: '13', keyword: 'Bio-hacking Supplements', volume: 140000, growth: 40, sentiment: 0.55, source: 'YouTube', timestamp: '2024-03-14' },
  { id: '14', keyword: 'Privacy-first Browsers', volume: 250000, growth: 75, sentiment: 0.88, source: 'Twitter', timestamp: '2024-03-14' },
  { id: '15', keyword: 'Digital Nomad Insurance', volume: 38000, growth: 95, sentiment: 0.7, source: 'Reddit', timestamp: '2024-03-13' },
].concat(Array.from({ length: 35 }).map((_, i) => ({
  id: `gen-${i}`,
  keyword: `Emerging Tech Topic ${i + 16}`,
  volume: Math.floor(Math.random() * 50000) + 10000,
  growth: Math.floor(Math.random() * 150) - 20,
  sentiment: Math.random(),
  source: ['Reddit', 'Twitter', 'LinkedIn', 'Quora'][Math.floor(Math.random() * 4)],
  timestamp: '2024-03-12'
})));

// Generate 100+ signals
export const mockSignals: BuyingSignal[] = [
  { id: 's1', text: "Looking for a reliable sustainable packaging supplier for my new e-commerce brand. Any recommendations?", intent: 'high', source: 'Reddit', category: 'E-commerce', timestamp: '2024-03-20' },
  { id: 's2', text: "Is there an AI tool that can manage my calendar and emails automatically? Willing to pay for a good one.", intent: 'high', source: 'Twitter', category: 'Productivity', timestamp: '2024-03-20' },
  { id: 's3', text: "Thinking about switching to plant-based leather for my next bag. Does it last long?", intent: 'medium', source: 'Quora', category: 'Fashion', timestamp: '2024-03-19' },
  { id: 's4', text: "Need a simple tool to track my affiliate links. Most options are too complex.", intent: 'high', source: 'Reddit', category: 'Marketing', timestamp: '2024-03-19' },
  { id: 's5', text: "What's the best platform for hosting a private community for paid members?", intent: 'high', source: 'LinkedIn', category: 'Community', timestamp: '2024-03-18' },
  { id: 's6', text: "Budgeting $5k/mo for a content marketing agency that understands SaaS. Who should I talk to?", intent: 'high', source: 'Twitter', category: 'SaaS', timestamp: '2024-03-18' },
  { id: 's7', text: "Anyone know a good developer who can build a custom Shopify app for subscription management?", intent: 'high', source: 'Reddit', category: 'E-commerce', timestamp: '2024-03-17' },
  { id: 's8', text: "Looking for a CRM that doesn't feel like it was built in 1995. Needs to be fast and minimal.", intent: 'medium', source: 'Twitter', category: 'Sales', timestamp: '2024-03-17' },
  ...Array.from({ length: 100 }).map((_, i): BuyingSignal => ({
    id: `sig-gen-${i}`,
    text: `Automated detection: User in r/${['startups', 'marketing', 'ecommerce'][Math.floor(Math.random() * 3)]} is asking for a solution to ${['automate social media', 'track inventory', 'manage remote teams', 'optimize ad spend'][Math.floor(Math.random() * 4)]}. Potential high-intent signal.`,
    intent: (Math.random() > 0.7 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
    source: ['Reddit', 'Twitter', 'Quora'][Math.floor(Math.random() * 3)] as any,
    category: ['Tech', 'Marketing', 'Sales', 'Operations'][Math.floor(Math.random() * 4)],
    timestamp: '2024-03-16'
  }))
];

export const mockPredictions: Prediction[] = [
  { id: 'p1', topic: 'Hyper-local E-commerce', probability: 0.85, timeframe: '6-12 months', reasoning: 'Rising shipping costs and consumer desire for faster delivery are driving demand for local fulfillment centers.' },
  { id: 'p2', topic: 'Decentralized Social Media', probability: 0.65, timeframe: '12-24 months', reasoning: 'Growing concerns over data privacy and platform censorship are pushing users toward federated protocols.' },
  { id: 'p3', topic: 'AI-generated Fashion Design', probability: 0.75, timeframe: '3-6 months', reasoning: 'Fast fashion brands are already testing AI to predict and design trends in real-time.' },
  { id: 'p4', topic: 'Micro-grid Energy Trading', probability: 0.60, timeframe: '2-3 years', reasoning: 'As solar adoption increases, peer-to-peer energy trading platforms will emerge to optimize local consumption.' },
  { id: 'p5', topic: 'Personalized Nutrition via AI', probability: 0.90, timeframe: '12 months', reasoning: 'Integration of wearable data with LLMs allows for real-time, highly specific dietary recommendations.' },
];

export const mockSentiment: SentimentData[] = [
  { name: 'Sustainable Packaging', positive: 70, neutral: 20, negative: 10 },
  { name: 'AI Assistants', positive: 55, neutral: 30, negative: 15 },
  { name: 'Plant-based Leather', positive: 80, neutral: 15, negative: 5 },
  { name: 'Micro-SaaS', positive: 60, neutral: 35, negative: 5 },
  { name: 'Vertical Farming', positive: 75, neutral: 20, negative: 5 },
  { name: 'Remote Wellness', positive: 45, neutral: 40, negative: 15 },
  { name: 'Carbon Capture', positive: 85, neutral: 10, negative: 5 },
];
