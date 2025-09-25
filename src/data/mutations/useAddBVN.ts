import { axiosInstance as axios } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  data?: any;
};

export const useAddBVN = () => {
  return useMutation<TAddBVNResponse, Error, AddBVNData>({
    mutationKey: ["add-bvn"],
    mutationFn: async ({ email, bvn, dob }) => {
      const res = await axios.post(
        `/v1/users/user/verify-bvn?email=${email}`,
        { bvn, dob }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("✅ BVN added successfully");
    },
    onError: (error) => {
      console.error("BVN error:", error);
      toast.error("❌ BVN verification failed. Try again.");
    },
  });
};
