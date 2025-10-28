import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/libs/axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponseData, AxiosError, { email: string; profileData: TProfile }>({
    mutationKey: ['update-profile'],
     mutationFn: async ({ email, profileData }: { email: string; profileData: TProfile }) => {
      const res = await axios.post<ProfileResponseData>(`/v1/users/user/set-profile?email=${email}`, profileData);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Profile updated successfully");
    },

    onError: (error: AxiosError<unknown, any>) => {
      console.error("Failed to update profile:", error);

      const message =
        (error.response?.data as ErrorResponse | undefined)?.responseMessage ||
        "Failed to update profile 😢";
      toast.error(message);
    },
  });
};
