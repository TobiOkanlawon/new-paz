import { axiosInstance as axios, storeToken } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type AddAccountData = {
  accountNumber: string;
  bank: string;
  accountName: string;
};

type AddBVNData = {
  email: string;
  bvn: string;
  dob: string;
};

export const useAddBVN = () => {
  return useMutation<TAddBVNResponse, AxiosError, AddBVNData>({
    mutationKey: ["add-bvn"],
    mutationFn: async (data) => {
      return await axios
        .post(`/v1/users/user/verify-bvn?email=${data.email}`, {
	  bvn: data.bvn,
	  dob: data.dob
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (data, variables, context) => {

      toast("BVN added successfully");
    },
    onError: () => {
      toast("An error occurred");
    },
  });
};
