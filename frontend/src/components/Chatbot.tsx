'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Bot, Send, User } from 'lucide-react';

export function Chatbot({ className }: { className?: string }) {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: 'assistant', content: 'Hello! I am FinPilot AI. How can I help you with your portfolio today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('finpilot_conv_id');
    if (savedId) {
      setConversationId(savedId);
      api.getChatHistory(savedId).then(history => {
        if (history && history.messages) {
          setMessages(history.messages);
        }
      }).catch(console.error);
    }
  }, []);

  const handleClearChat = async () => {
    if (!conversationId) {
      setMessages([{ role: 'assistant', content: 'Hello! I am your advanced AI financial advisor powered by Groq and HuggingFace FinBERT sentiment models. How can I help you analyze cryptocurrencies, precious metals, or your portfolio positions today?' }]);
      return;
    }
    try {
      await api.clearChat(conversationId);
      localStorage.removeItem('finpilot_conv_id');
      setConversationId(null);
      setMessages([{ role: 'assistant', content: 'Hello! I am your advanced AI financial advisor powered by Groq and HuggingFace FinBERT sentiment models. How can I help you analyze cryptocurrencies, precious metals, or your portfolio positions today?' }]);
    } catch (e) {
      console.error(e);
    }
  };

  const sendPredefinedMessage = async (userMessage: string) => {
    if (isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(userMessage, conversationId);
      if (response.conversationId) {
        setConversationId(response.conversationId);
        localStorage.setItem('finpilot_conv_id', response.conversationId);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full rounded-3xl bg-card border border-border shadow-sm', className)}>
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground leading-tight">Beacon AI</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <button onClick={handleClearChat} className="text-xs text-muted-foreground hover:text-red-500 bg-secondary/50 hover:bg-red-500/10 px-2 py-1 rounded transition-colors">
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-[300px]">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex gap-3 max-w-[85%]', msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start')}>
            <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
              msg.role === 'user' ? 'bg-secondary text-foreground border border-border/50' : 'bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20'
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={cn('p-3.5 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md shadow-primary/20'
                : 'bg-secondary/80 backdrop-blur-md border border-border/50 text-foreground rounded-tl-sm shadow-sm'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20">
              <Bot size={14} />
            </div>
            <div className="p-3.5 rounded-2xl bg-secondary/80 backdrop-blur-md border border-border/50 text-foreground rounded-tl-sm shadow-sm flex items-center gap-2 h-11">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-2 mt-auto">
        <div className="mb-3 text-xs text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 leading-relaxed text-center">
          In a full version, this chatbot can answer any question about your portfolio, but it is restricted for this demo.
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
        </div>
        <form className="relative" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            disabled
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Text input disabled in demo..."
            className="w-full rounded-2xl bg-secondary/50 py-3 pl-4 pr-12 text-sm text-muted-foreground outline-none border border-border cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/50 cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
