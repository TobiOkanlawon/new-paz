import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/libs/axios";
import { toast } from "react-toastify";

type FamilyVaultData = {
  title: string;
  description: string;
  currentAmount: number;
  walletId: string;
  frequency: "Yearly" | "Monthly";
  type: "FAMILYVAULT";
};

export const useCreateFamilyVault = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-family-vault"],
    mutationFn: async (data: FamilyVaultData) => {
      return await axios.post("/v1/users/user/savings/create-savings", data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-details"] });
      toast.success("Family Vault Plan created successfully");
    },

    onError: () => {
      toast.success(
        "An error occured while trying to create family vault plan",
      );
    },
  });
};
