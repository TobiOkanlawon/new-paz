import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenState {
  token: string | null;
  setToken: (newToken: string) => void;
  removeToken: () => void;
}

const useToken = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (newToken) => set(() => ({ token: newToken })),
      removeToken: () => set(() => ({ token: null })),
    }),
    {
      name: 'auth-token', // key used in localStorage
      partialize: (state) => ({ token: state.token }), // only persist `token`
    }
  )
);

export default useToken;
