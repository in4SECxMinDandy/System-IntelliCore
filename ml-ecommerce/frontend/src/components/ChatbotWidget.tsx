'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'bot',
  content: "Hi! I'm IntelliCore AI Assistant 🤖 I can help you find products, answer questions, and provide personalized recommendations. How can I help you today?",
  timestamp: new Date(),
  suggestions: [
    'Show me trending products',
    'Help me find a gift',
    'What are your best deals?',
    'Track my order',
  ],
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/message', {
        message: content.trim(),
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.data.message || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
        suggestions: response.data.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);

      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96',
            'bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700',
            'flex flex-col transition-all duration-300 animate-scale-in',
            isMinimized ? 'h-14' : 'h-[500px] max-h-[80vh]'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-t-2xl">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">IntelliCore AI</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      message.role === 'bot'
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                        : 'bg-gray-200 dark:bg-dark-700'
                    )}>
                      {message.role === 'bot'
                        ? <Bot className="w-3.5 h-3.5 text-white" />
                        : <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                      }
                    </div>

                    <div className={cn('flex flex-col gap-1 max-w-[80%]', message.role === 'user' && 'items-end')}>
                      {/* Bubble */}
                      <div className={cn(
                        'px-3 py-2 rounded-2xl text-sm leading-relaxed',
                        message.role === 'bot'
                          ? 'chat-bubble-bot rounded-bl-sm'
                          : 'chat-bubble-user rounded-br-sm'
                      )}>
                        {message.content}
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {message.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestion(suggestion)}
                              className="px-2.5 py-1 text-xs rounded-full border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="chat-bubble-bot rounded-bl-sm flex items-center gap-1 px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-100 dark:border-dark-700">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 input py-2 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Powered by IntelliCore AI
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className={cn(
          'fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all duration-300',
          'bg-gradient-to-br from-primary-600 to-accent-600 text-white',
          'hover:shadow-glow-lg hover:scale-110 active:scale-95',
          isOpen && 'rotate-0'
        )}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
