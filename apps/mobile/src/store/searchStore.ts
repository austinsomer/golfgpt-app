import { create } from 'zustand';

interface SearchState {
  date: Date;
  players: number;
  county: string | null;
  setDate: (date: Date) => void;
  setPlayers: (n: number) => void;
  setCounty: (county: string | null) => void;
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
  setDate: (date) => set({ date }),
  setPlayers: (players) => set({ players }),
  setCounty: (county) => set({ county }),
  reset: () => set({ date: today(), players: 2, county: null }),
}));
