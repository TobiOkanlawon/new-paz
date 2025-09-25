import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: TUser | null;
  setUser: (updatedFields: Partial<TUser>) => void;
  replaceUser: (newUser: TUser) => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      // Partial update
      setUser: (updatedFields) =>
        set((state) => {
          if (!state.user) {
            console.warn("User is null. Can't perform partial update.");
            return {};
          }

          return {
            user: {
              ...state.user,
              ...updatedFields,
            },
          };
        }),

      // Full replacement
      replaceUser: (newUser) =>
        set(() => ({
          user: newUser,
        })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUser;
