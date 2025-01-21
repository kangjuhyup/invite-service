import { create } from 'zustand';

const isBrowser = typeof window !== 'undefined';

interface LoginState {
  access: string | null;
  refresh: string | null;
  isLogin: boolean;
  setToken: (param: { access: string; refresh: string }) => void;
  clearToken: () => void;
  checkLoginStatus: () => boolean;
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000;
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
};

const useLoginStore = create<LoginState>((set, get) => ({
  access: isBrowser ? localStorage.getItem('access') : null,
  refresh: isBrowser ? localStorage.getItem('refresh') : null,
  isLogin: false,
  setToken: ({ access, refresh }) => {
    if (isBrowser) {
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
    }
    const isValid = isTokenValid(access);
    set({ access, refresh, isLogin: isValid });
  },
  clearToken: () => {
    if (isBrowser) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
    set({ access: null, refresh: null, isLogin: false });
  },
  checkLoginStatus: () => {
    const { access } = get();
    const isValid = isTokenValid(access);
    set({ isLogin: isValid });
    return isValid;
  },
}));

export default useLoginStore;
