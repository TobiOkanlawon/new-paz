import { axiosInstance as axios } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SoloSaverData = {
  title: string;
  description: string;
  currentAmount: number; // this doesn't actually set the currentAmount... I don't know why it's a field though
  walletId: string;
  type: "SOLO";
};

export const useCreateSoloSaver = (email: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-solo-saver"],
    mutationFn: async (data: SoloSaverData) => {
      return await axios.post(`/v1/users/user/savings/create-savings`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-details"] });
    },
  });
};
