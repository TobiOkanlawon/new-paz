import {useMutation, useQueryClient} from "@tanstack/react-query";
import {axiosInstance as axios} from "@/libs/axios";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
    return useMutation<
    ResetPasswordResponseData,
    ErrorResponse,
    { email: string }
  >({
    mutationKey: ["reset-password"],
    mutationFn: async ({ email }) => {
      const res = await axios.post<ResetPasswordResponseData>(
        `/v1/users/user/forgot-password?email=${email}`
      );
      return res.data;
    },

    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error) => {
      console.error("Failed to reset password:", error);
      toast.error(error?.responseMessage);
    },
  });
}