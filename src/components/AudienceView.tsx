import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SentimentData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Smile, Meh, Frown } from 'lucide-react';

interface AudienceViewProps {
  sentiment: SentimentData[];
}

const COLORS = ['#10b981', '#71717a', '#ef4444'];

export const AudienceView: React.FC<AudienceViewProps> = ({ sentiment }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-sans font-medium text-zinc-100">Sentiment Distribution</CardTitle>
                <CardDescription className="text-zinc-500">How people feel about top trends</CardDescription>
              </div>
              <Users className="text-zinc-500" size={20} />
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentiment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={11} 
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="neutral" stackId="a" fill="#71717a" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4 text-xs font-mono uppercase tracking-widest">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400" /> Positive
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-zinc-500" /> Neutral
              </div>
              <div className="flex items-center gap-2 text-rose-400">
                <div className="w-2 h-2 rounded-full bg-rose-400" /> Negative
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-500">Top Sentiment Driver</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Smile size={24} />
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-100">Sustainable Packaging</p>
                  <p className="text-sm text-zinc-500">80% positive sentiment driven by eco-conscious Reddit communities.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-500">Emerging Concern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <Frown size={24} />
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-100">AI Privacy</p>
                  <p className="text-sm text-zinc-500">Rising negative sentiment regarding data usage in AI Personal Assistants.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
