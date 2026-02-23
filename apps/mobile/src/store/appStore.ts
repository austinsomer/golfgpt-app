import { create } from 'zustand';

interface AppState {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  showOnboarding: false,
  setShowOnboarding: (show) => set({ showOnboarding: show }),
}));
