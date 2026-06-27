import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const DEFAULT_PROFILE_IMAGE = "/profile.png";

interface UserStore {
  user: TUser | null;
  profileImage: string;
  setUser: (updatedFields: Partial<TUser>) => void;
  replaceUser: (newUser: TUser) => void;
  setProfileImage: (url: string) => void;
}

const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      profileImage: DEFAULT_PROFILE_IMAGE,

      setUser: (updatedFields) =>
        set((state) => {
          if (!state.user) {
            console.warn("User is null. Can't perform partial update.");
            return state;
          }

          return {
            user: {
              ...state.user,
              ...updatedFields,
            },
          };
        }),

      replaceUser: (newUser) =>
        set(() => ({
          user: newUser,
        })),

      setProfileImage: (url) => set({ profileImage: url }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, profileImage: state.profileImage }),
    },
  ),
);


export default useUser;
