import { axiosInstance as axios, storeToken } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type SignInData = {
  email: string;
  password: string;
  remember?: boolean;
};

export const useLogin = () => {
  return useMutation<TLoginResponse, any, SignInData>({
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
      toast.error(error.response?.data.responseMessage);
    },
  });
};
