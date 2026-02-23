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

const WELCOME_MESSAGES = [
  "Public courses. Real prices. No velvet ropes.\n\nTell me where you want to play, when, and how many — I'll find what's open.",
  "Golf's meant to be walked and talked. Drop your county, budget, or player count and I'll pull what's available.",
  "No tee box is off limits here. Ask me anything about Utah tee times — try: \"Under $40 in Salt Lake, 2 players, this Saturday morning.\"",
  "You're in the Loop. Ask me for times — where do you want to play?",
];

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
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
