import { create } from 'zustand';

interface SearchState {
  date: string | null;
  players: number;
  county: string | null;
  setDate: (date: string) => void;
  setPlayers: (n: number) => void;
  setCounty: (county: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  date: null,
  players: 2,
  county: null,
  setDate: (date) => set({ date }),
  setPlayers: (players) => set({ players }),
  setCounty: (county) => set({ county }),
  reset: () => set({ date: null, players: 2, county: null }),
}));
