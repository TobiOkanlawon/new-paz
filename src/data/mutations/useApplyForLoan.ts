import { axiosInstance as axios } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type TLoanApplication = {
  productName: string;
  walletId: string;
  amount: number;
  duration: string;
  purpose: string;
};

export const useApplyForLoan = () => {
  const queryClient = useQueryClient();
  type LoanApplicationResponse = { success: boolean; message: string; data?: unknown };

  return useMutation<LoanApplicationResponse, AxiosError, TLoanApplication>({
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
      queryClient.invalidateQueries({queryKey: ["account-details", "get-user-wallet", "get-loan-status"]})
    },
    onError: () => {
      toast("An error occurred");
    },
  });
};
