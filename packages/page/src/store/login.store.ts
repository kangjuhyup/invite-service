import { create } from 'zustand';

const isBrowser = typeof window !== 'undefined';

interface LoginState {
  access: string | null;
  refresh: string | null;
  setToken: (param: { access: string; refresh: string }) => void;
  clearToken: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  access: isBrowser ? localStorage.getItem('access') : null,
  refresh: isBrowser ? localStorage.getItem('refresh') : null,
  setToken: ({ access, refresh }) => {
    if (isBrowser) {
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
    }
    set({ access, refresh });
  },
  clearToken: () => {
    if (isBrowser) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
    set({ access: null, refresh: null });
  },
}));

export default useLoginStore;
