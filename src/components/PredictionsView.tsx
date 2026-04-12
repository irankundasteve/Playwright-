import React from 'react';
import { Prediction } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Target, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PredictionsViewProps {
  predictions: Prediction[];
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({ predictions }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-amber-400">
        <Sparkles size={20} />
        <h2 className="text-2xl font-sans font-medium text-zinc-100">AI Predictions</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-zinc-800 bg-zinc-950/50 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-sans font-medium text-zinc-100">
                    {prediction.topic}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-mono text-zinc-500 uppercase">Probability</p>
                      <p className="text-lg font-mono font-bold text-amber-400">{Math.round(prediction.probability * 100)}%</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    {prediction.timeframe}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full">
                    <Target size={14} />
                    Strategic Opportunity
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Reasoning</p>
                  <p className="text-zinc-300 leading-relaxed">
                    {prediction.reasoning}
                  </p>
                </div>

                <button className="flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors group/btn">
                  View Full Analysis <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
