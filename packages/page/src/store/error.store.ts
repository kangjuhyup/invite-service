import { create } from "zustand";

interface ErrorState {
  error: string | null;
  setError: (message: string) => void;
  clearError: () => void;
}

const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (message: string) => set({ error: message }),
  clearError: () => set({ error: null }),
}));

export default useErrorStore;
