import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = (email: string) => {
  return useQuery<any, any, ProfileResponseData["profile"]>({
    queryKey: ["get-profile"],
    queryFn: async () => {
      return await axios.post(`/v1/users/user/get-profile?email=${email}`).then((res) => {
	return res.data.profile;
      })
    }
  });
};
