import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
      name: "auth-token",

      partialize: (state) => ({
        token: state.token,
      }),

      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useToken;
