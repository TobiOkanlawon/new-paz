import { axiosInstance as axios, storeToken } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type TLoanApplication = {
  productName: string;
  walletId: string;
  amount: number;
  duration: string;
  purpose: string;
};

export const useApplyForLoan = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, TLoanApplication>({
    mutationKey: ["loan-application"],
    mutationFn: async (data) => {
      return await axios
        .post(`/v1/loan/request/apply`, data)
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (data, variables, context) => {
      toast("Loan application submitted")
      queryClient.invalidateQueries({queryKey: ["account-details", "get-user-wallet"]})
    },
    onError: () => {
      toast("An error occurred");
    },
  });
};
