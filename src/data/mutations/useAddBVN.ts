import { axiosInstance as axios } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useUser from "@/store/userStore";

// Define your mutation input
type AddBVNData = {
  email: string;
  bvn: string;
  dob: string;
};

// Optional: define the expected API response
type TAddBVNResponse = {
  success: boolean;
  message: string;
  data?: {
    bvn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
};

export const useAddBVN = () => {
  const {setUser} = useUser();
  return useMutation<TAddBVNResponse, AxiosError<ErrorResponse>, AddBVNData>({
    mutationKey: ["add-bvn"],
    mutationFn: async ({ email, bvn, dob }) => {
      const res = await axios.post(
        `/v1/users/user/verify-bvn?email=${email}`,
        { bvn, dob }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser({wallet_account: data.data?.wallet_account})
      toast.success("BVN added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data.responseMessage);
    },
  });
};
