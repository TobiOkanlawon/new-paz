import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ProfileResponse {
  success: boolean;
  message: string;
  profile: ProfileResponseData["profile"];
}

export const useGetProfile = (email: string) => {
  return useQuery<ProfileResponse, AxiosError, ProfileResponseData["profile"]>({
    queryKey: ["get-profile"],
    queryFn: async () => {
      const { data } = await axios.post<ProfileResponse>(`/v1/users/user/get-profile?email=${email}`);
      return data;
    },
    select: (data) => data.profile,
    enabled: !!email,
  });
};
