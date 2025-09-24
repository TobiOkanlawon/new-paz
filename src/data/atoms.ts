import { atom } from "recoil";

export const userState = atom<TUser | null>({
  key: "userState",
  default: null,
});

export const authTokenState = atom<string | null>({
  key: "authTokenState",
  default: null,
})
