import { create } from 'zustand';

export type TimeOfDay = 'morning' | 'afternoon' | null;

interface SearchState {
  date: Date;
  players: number;
  county: string | null;
  timeOfDay: TimeOfDay;
  setDate: (date: Date) => void;
  setPlayers: (n: number) => void;
  setCounty: (county: string | null) => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  reset: () => void;
}

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const useSearchStore = create<SearchState>((set) => ({
  date: today(),
  players: 2,
  county: null,
  timeOfDay: null,
  setDate: (date) => set({ date }),
  setPlayers: (players) => set({ players }),
  setCounty: (county) => set({ county }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  reset: () => set({ date: today(), players: 2, county: null, timeOfDay: null }),
}));
