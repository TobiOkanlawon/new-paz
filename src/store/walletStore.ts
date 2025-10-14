import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletStore = {
  walletInformation: TWalletInfo | null;
  setWalletInformation: (walletInformation: TWalletInfo) => void;
};

export const useWallet = create<WalletStore>()(
  persist(
    (set) => ({
      walletInformation: null,
      setWalletInformation: (w: TWalletInfo) => set({ walletInformation: w }),
    }),
    {
      name: "wallet-information",
      partialize: (state) => ({ walletInformation: state.walletInformation }),
    },
  ),
);
