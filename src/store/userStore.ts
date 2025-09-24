import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: TUser | null;
  setUser: (user: TUser) => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUser;
