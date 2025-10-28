import { axiosInstance as axios } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type AddAccountData = {
  accountNo: string;
  bankName: string;
  accountName: string;
  walletId: string;
};

export const useAddAccount = () => {
  return useMutation<TAddAccountResponse, AxiosError, AddAccountData>({
    mutationKey: ["add-account"],
    mutationFn: async (data) => {
      return await axios
        .post(`/v1/users/user/add-account`, data)
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (data, variables, context) => {
      toast("Account added successfully");
    },
    onError: () => {
      toast("An error occurred");
    },
  });
};
