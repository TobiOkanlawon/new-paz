import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAccountDetails = (email: string) => {
  return useQuery<any, any, TAccountDetails>({
    queryKey: ["account-details"],
    queryFn: async () => {
      return await axios.get(`/v1/users/user/account-details?email=${email}`).then((res) => {
	return res.data.accountDetails;
      });
    },
  });
};
