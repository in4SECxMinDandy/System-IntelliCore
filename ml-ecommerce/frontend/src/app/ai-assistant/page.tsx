'use client';

import { useState } from 'react';
import { 
  Send, Bot, User, Sparkles, MessageSquare, 
  ThumbsUp, ThumbsDown, Share2, Copy, RefreshCw,
  Image as ImageIcon, Mic, Paperclip, Search, Package
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { label: 'Find products like...', icon: Search },
  { label: 'Get recommendations', icon: Sparkles },
  { label: 'Compare prices', icon: ThumbsUp },
  { label: 'Track order', icon: Package },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI shopping assistant. I can help you find products, make recommendations, compare prices, and more. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'Find running shoes under $100',
        'Show me trending electronics',
        'What\'s the best laptop for coding?',
        'Recommend gifts for gamers'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Based on your preferences, I found some great options for you! Here are my top picks...',
        timestamp: new Date(),
        suggestions: [
          'Tell me more about the first option',
          'Show me similar products',
          'Add to cart',
          'Compare prices'
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A100A] border-b border-[#4A3021] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f27f0d] to-[#d16b08] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">AI Shopping Assistant</h1>
              <p className="text-xs text-[#baab9c]">Powered by ML Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <RefreshCw className="w-5 h-5 text-[#baab9c]" />
            </button>
            <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
              <Share2 className="w-5 h-5 text-[#baab9c]" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#393028] p-4 hidden md:block">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2D241B] text-white">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">New Chat</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#baab9c] hover:bg-[#2D241B] transition-colors">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Recommendations</span>
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xs font-medium text-[#baab9c] uppercase tracking-wider mb-3 px-4">Recent</h3>
            <div className="space-y-1">
              {['Running shoes options', 'Laptop recommendations', 'Gift ideas'].map((item, i) => (
                <button key={i} className="w-full text-left px-4 py-2 text-sm text-[#baab9c] hover:text-white hover:bg-[#2D241B] rounded-lg transition-colors truncate">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant' ? 'bg-gradient-to-br from-[#f27f0d] to-[#d16b08]' : 'bg-[#2D241B]'}`}>
                  {message.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-[#f27f0d] text-white' : 'bg-[#221910] text-white'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button 
                          key={i}
                          onClick={() => setInput(suggestion)}
                          className="text-xs px-3 py-1.5 rounded-full bg-[#2D241B] text-[#baab9c] hover:text-white hover:bg-[#393028] transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-[#baab9c] mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f27f0d] to-[#d16b08] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#221910] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#baab9c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#baab9c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#baab9c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#393028]">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about products, recommendations, or orders..."
                  className="w-full bg-[#221910] border border-[#393028] rounded-xl pl-4 pr-24 py-4 text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-[#393028] transition-colors">
                    <ImageIcon className="w-5 h-5 text-[#baab9c]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#393028] transition-colors">
                    <Mic className="w-5 h-5 text-[#baab9c]" />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="p-2 rounded-lg bg-[#f27f0d] text-white hover:bg-[#d16b08] transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#baab9c] mt-2 text-center">
                AI can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        </main>

        {/* Right Panel - Product Results */}
        <aside className="w-80 border-l border-[#393028] p-4 hidden lg:block overflow-y-auto">
          <h3 className="text-sm font-medium text-white mb-4">Recommended Products</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#221910] rounded-xl p-3 hover:ring-1 hover:ring-[#f27f0d] transition-all cursor-pointer">
                <div className="aspect-square bg-[#2D241B] rounded-lg mb-2"></div>
                <p className="text-sm text-white line-clamp-2">Premium Wireless Headphones</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-[#f27f0d]">$99.99</span>
                  <span className="text-xs text-[#baab9c]">⭐ 4.8</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-[#f27f0d] hover:text-white border border-[#f27f0d] rounded-lg hover:bg-[#f27f0d] transition-colors">
            View All Results
          </button>
        </aside>
      </div>
    </div>
  );
}
