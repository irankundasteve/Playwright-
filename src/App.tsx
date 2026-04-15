/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendsView } from '@/components/TrendsView';
import { AudienceView } from '@/components/AudienceView';
import { SignalsView } from '@/components/SignalsView';
import { PredictionsView } from '@/components/PredictionsView';
import { AIInsights } from '@/components/AIInsights';
import { mockTrends, mockSignals, mockPredictions, mockSentiment } from './mockData';
import { BarChart3, Users, Zap, Sparkles, Brain, Search, Bell, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('trends');

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Zap className="text-zinc-950" size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-sans font-bold tracking-tight text-zinc-100">
              TrendPulse <span className="text-zinc-500 font-normal">AI</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search markets..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 w-64 transition-colors"
              />
            </div>
            <button className="text-zinc-400 hover:text-zinc-100 transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-zinc-800" />
          </div>

          <button className="md:hidden text-zinc-400">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Dashboard Content */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-1">Market Intelligence Dashboard</p>
              <h2 className="text-3xl font-sans font-bold text-zinc-100">Global Trend Analysis</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Data Feed: Reddit, Twitter, LinkedIn
            </div>
          </motion.div>

          <Tabs defaultValue="trends" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl mb-6">
              <TabsTrigger value="trends" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 rounded-lg px-6 py-2 transition-all">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  Trends
                </div>
              </TabsTrigger>
              <TabsTrigger value="audience" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 rounded-lg px-6 py-2 transition-all">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Audience
                </div>
              </TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 rounded-lg px-6 py-2 transition-all">
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  Signals
                </div>
              </TabsTrigger>
              <TabsTrigger value="predictions" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 rounded-lg px-6 py-2 transition-all">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Predictions
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="mt-0">
              <TrendsView trends={mockTrends} />
            </TabsContent>
            <TabsContent value="audience" className="mt-0">
              <AudienceView sentiment={mockSentiment} />
            </TabsContent>
            <TabsContent value="signals" className="mt-0">
              <SignalsView signals={mockSignals} />
            </TabsContent>
            <TabsContent value="predictions" className="mt-0">
              <PredictionsView predictions={mockPredictions} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: AI Insights & Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <AIInsights />
            
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 space-y-4">
              <div className="flex items-center gap-2 text-zinc-100">
                <Zap size={18} className="text-amber-400" />
                <h3 className="font-medium">Automation Setup</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                The daily scraper is configured via GitHub Actions. To activate:
              </p>
              <ul className="text-[11px] text-zinc-400 space-y-2 list-disc pl-4">
                <li>Scraper runs daily at 00:00 UTC</li>
                <li>Searches DuckDuckGo for tech news</li>
                <li>Crawls top articles for deep insights</li>
                <li>Data saved to <code className="text-zinc-200">raw_data.json</code></li>
                <li>Committed directly to your repo</li>
              </ul>
              <Button variant="outline" className="w-full text-xs border-zinc-800 hover:bg-zinc-900 h-8">
                View Scraper Code
              </Button>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 space-y-4">
              <div className="flex items-center gap-2 text-zinc-100">
                <Brain size={18} className="text-zinc-400" />
                <h3 className="font-medium">System Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Data Ingestion</span>
                  <span className="text-emerald-400 font-mono">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Analysis Engine</span>
                  <span className="text-emerald-400 font-mono">Optimized</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Last Sync</span>
                  <span className="text-zinc-400 font-mono">14s ago</span>
                </div>
              </div>
              <div className="pt-4">
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <p className="text-[10px] font-mono text-zinc-600 mt-2 uppercase tracking-widest">Storage: 276.4 GB / 300 GB (HuggingFace)</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            © 2024 TrendPulse AI • Market Intelligence Platform
          </p>
          <div className="flex gap-6 text-xs font-mono text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
