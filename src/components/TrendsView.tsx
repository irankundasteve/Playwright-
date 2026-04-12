import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trend } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TrendsViewProps {
  trends: Trend[];
}

export const TrendsView: React.FC<TrendsViewProps> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trends.slice(0, 3).map((trend) => (
          <Card key={trend.id} className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                {trend.source}
              </CardDescription>
              <CardTitle className="text-lg font-sans font-medium text-zinc-100">
                {trend.keyword}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-bold text-zinc-100">
                    {trend.volume.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500">Monthly Volume</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${trend.growth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trend.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(trend.growth)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-sans font-medium text-zinc-100">Volume Analysis</CardTitle>
              <CardDescription className="text-zinc-500">Keyword search volume across platforms</CardDescription>
            </div>
            <Activity className="text-zinc-500" size={20} />
          </div>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="keyword" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#f4f4f5' }}
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
