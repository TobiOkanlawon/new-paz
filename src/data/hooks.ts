import { create } from "zustand";

export const useUser = create((set) => ({
  user: null,
}));
