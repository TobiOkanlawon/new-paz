import { useMutation } from "@tanstack/react-query";
import { axiosInstance as axios } from "../../../libs/axios";
import { toast } from "react-toastify";

export default function useRegister(data: TRegister) {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async () => {
      const cleanedData = {
        email: data.email,
        password: data.password,
        mobileNumber: data.phoneNumber,
        first_name: data.firstName,
        last_name: data.lastName,
      };
      return axios.post("/v1/users/signup", cleanedData);
    },
    onSuccess: () => {
      toast.success("Account created successfully!", {
        toastId: "sign-up-successful",
      });
    },
    onError: () => {
      toast.error("Account creation failed", {
        toastId: "sign-up-failed",
      });
    },
  });
}
