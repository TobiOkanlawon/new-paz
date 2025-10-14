import { axiosInstance as axios } from "@/libs/axios";
import { storeToken } from "@/libs/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useWallet } from "@/store/walletStore";

type SignInData = {
  email: string;
  password: string;
  remember?: boolean;
};

export const useLogin = () => {
  const { setWalletInformation } = useWallet();
  return useMutation<TLoginResponse, AxiosError, SignInData>({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      return await axios
        .post("/v1/users/user/login", {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (data, variables, context) => {
      if (variables.remember) {
        storeToken(data.token);
      }
      toast("Login successful");
    },
    onError: (error) => {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "responseMessage" in error.response.data
      ) {
        toast.error(
          (error.response.data as { responseMessage: string }).responseMessage,
        );
      } else {
        toast.error("An error occurred");
      }
    },
  });
};
