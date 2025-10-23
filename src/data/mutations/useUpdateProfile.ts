import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/libs/axios";
import { toast } from "react-toastify";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: async (profileData: TProfile) => {
      return await axios.post(`/v1/users/user/set-profile`, profileData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Profile updated successfully");
    },

    onError: (error: any) => {
      console.error("Failed to update profile:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update profile 😢"
      );
    },
  });
};
