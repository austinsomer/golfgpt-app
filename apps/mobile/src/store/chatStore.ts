import { create } from 'zustand';
import { TeeTimeResult } from '../api/chat';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  teeTimeResults?: TeeTimeResult[];
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (v: boolean) => void;
  clearChat: () => void;
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey — I'm Caddy Bot. Ask me anything about tee times in Utah. Try: \"Under $40 in Salt Lake this Saturday morning for 2 players.\"",
  timestamp: Date.now(),
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [WELCOME],
  isLoading: false,
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: String(Date.now() + Math.random()), timestamp: Date.now() },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearChat: () => set({ messages: [WELCOME], isLoading: false }),
}));
