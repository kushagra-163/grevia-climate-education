import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AiStore {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: { role: 'user' | 'assistant' | 'system'; content: string }) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useAiStore = create<AiStore>((set) => ({
  messages: [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 **Welcome to Grevia Eco-Coach!**\n\nI'm your AI climate mentor. You can ask me anything about climate science, sustainable daily habits, renewable energy, or request personalized eco-tips!`,
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36).substring(2, 9),
          ...msg,
          timestamp: new Date(),
        },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Conversation reset. How can I assist your climate journey today?',
          timestamp: new Date(),
        },
      ],
    }),
}));
