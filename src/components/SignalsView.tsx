import React from 'react';
import { BuyingSignal } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, MessageSquare, ExternalLink } from 'lucide-react';

interface SignalsViewProps {
  signals: BuyingSignal[];
}

export const SignalsView: React.FC<SignalsViewProps> = ({ signals }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-sans font-medium text-zinc-100">Buying Signals</h2>
          <p className="text-zinc-500">High-intent conversations detected in the wild</p>
        </div>
        <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono">
          {signals.length} Signals Detected
        </Badge>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {signals.map((signal) => (
            <Card key={signal.id} className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        signal.intent === 'high' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        signal.intent === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }>
                        {signal.intent.toUpperCase()} INTENT
                      </Badge>
                      <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{signal.source}</span>
                      <span className="text-xs font-mono text-zinc-600">•</span>
                      <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{signal.category}</span>
                    </div>
                    
                    <p className="text-zinc-300 leading-relaxed italic">
                      "{signal.text}"
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} /> Original Post
                      </span>
                      <span>{signal.timestamp}</span>
                    </div>
                  </div>
                  
                  <button className="p-2 rounded-lg bg-zinc-900 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-100">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
