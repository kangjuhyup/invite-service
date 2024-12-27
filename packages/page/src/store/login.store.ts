import { create } from 'zustand';

interface LoginState {
  access: string | null;
  refresh: string | null;
  setToken: (param: { access: string; refresh: string }) => void;
  clearToken: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  access: null,
  refresh: null,
  setToken: ({ access, refresh }) => set({ access, refresh }),
  clearToken: () => set({ access: null, refresh: null }),
}));

export default useLoginStore;
