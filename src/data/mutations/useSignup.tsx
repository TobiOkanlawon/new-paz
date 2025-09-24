import { axiosInstance as axios } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type SignUpRequestBody = {
  mobileNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const signUpRequest = (args: SignUpRequestBody) => {
  return axios.post("v1/users/signup", {
    mobileNumber: args.mobileNumber,
    firstName: args.firstName,
    lastName: args.lastName,
    email: args.email,
    password: args.password,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationKey: ["sign up"],
    mutationFn: (data: SignUpRequestBody) => signUpRequest(data),

    onSuccess: () => {
      toast("Sign up successful", {
        type: "success",
      });
    },
    onError: () => {
      toast("An error occured while trying to sign up", {
        type: "error",
      });
    },
  });
};
