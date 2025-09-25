import { axiosInstance as axios } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
  return useMutation<any, AxiosError<ErrorResponse>, any>({
    mutationKey: ["sign up"],
    mutationFn: (data: SignUpRequestBody) => signUpRequest(data),

    onSuccess: () => {
      toast.success("Sign up successful. Log in");
    },
    onError: (error) => {
      toast.error(error.response?.data.responseMessage);
    },
  });
};
