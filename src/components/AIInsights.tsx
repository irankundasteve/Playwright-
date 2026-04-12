import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIInsights: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your TrendPulse AI assistant. Ask me anything about the current market trends, audience behavior, or potential business opportunities." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a world-class market intelligence analyst. You have access to real-time data from Reddit, Twitter, and other public sources. Provide concise, data-driven insights. Focus on identifying 'white space' opportunities and actionable strategies for founders and marketers."
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't generate an insight for that." }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "There was an error connecting to the AI service. Please check your API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 flex flex-col h-[600px]">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100">
          <Brain size={20} className="text-purple-400" />
          <CardTitle className="text-lg font-sans font-medium">Market Intelligence AI</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-lg h-fit ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-purple-500/10 text-purple-400'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 h-fit animate-pulse">
                  <Bot size={18} />
                </div>
                <div className="bg-zinc-900 text-zinc-500 p-3 rounded-2xl rounded-tl-none border border-zinc-800 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing market data...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Ask about market opportunities..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-purple-500/50"
            />
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
