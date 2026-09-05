import React, { useState } from 'react';
import { useAiStore } from '../store/aiStore';
import { aiApi } from '../api/aiApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Leaf, Send, Sparkles, Trash2, Bot, User } from 'lucide-react';

export const EcoCoach: React.FC = () => {
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useAiStore();
  const [input, setInput] = useState('');

  const starterPrompts = [
    'Why is climate change happening?',
    'What are the most effective daily sustainable habits?',
    'How do solar panels generate clean electricity?',
    'Explain the difference between carbon neutral and net zero.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    addMessage({ role: 'user', content: query });
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role !== 'system')
        .concat({ id: 'temp', role: 'user', content: query, timestamp: new Date() })
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await aiApi.chat(history);
      addMessage({ role: 'assistant', content: res.reply });
    } catch (err: any) {
      addMessage({
        role: 'assistant',
        content: '🌱 **Eco-Coach**: I encountered a momentary connection glitch. Please check your network or try asking again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-earth-text">AI Eco-Coach Workspace</h1>
            <p className="text-xs text-earth-muted">Ask questions, explore sustainability habits, or get instant climate explanations.</p>
          </div>
        </div>

        <Button size="sm" variant="ghost" onClick={clearMessages} className="text-earth-muted hover:text-rose-500 space-x-1">
          <Trash2 className="w-4 h-4" />
          <span>Clear Chat</span>
        </Button>
      </div>

      {/* Main Chat Box */}
      <Card className="flex flex-col h-[65vh] p-0 overflow-hidden border-earth-border">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-earth-primary text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-earth-secondary border border-earth-border text-earth-text rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-earth-secondary border border-earth-border flex items-center justify-center text-earth-muted shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-earth-secondary border border-earth-border px-4 py-3 rounded-2xl text-xs text-earth-muted flex items-center space-x-2">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
                <span className="ml-2 font-medium">Eco-Coach is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Starter Prompt Pills */}
        <div className="p-4 bg-earth-secondary/80 border-t border-earth-border">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-earth-surface hover:bg-earth-primary-soft border border-earth-border hover:border-earth-primary/40 text-xs text-earth-muted hover:text-earth-primary-light transition-all shrink-0 font-medium"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 mt-2"
          >
            <Input
              placeholder="Ask Eco-Coach anything about climate, energy, or habits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-earth-surface border-earth-border"
            />
            <Button type="submit" isLoading={isLoading} className="shrink-0 space-x-2">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
