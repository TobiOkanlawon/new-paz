import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface AccountDetailsResponse {
  success: boolean;
  message: string;
  accountDetails: TAccountDetails;
}

export const useGetAccountDetails = (email: string) => {
  return useQuery<AccountDetailsResponse, AxiosError, TAccountDetails>({
    queryKey: ["account-details"],
    queryFn: async () => {
      return await axios.get(`/v1/users/user/account-details?email=${email}`).then((res) => {
	return res.data.accountDetails;
      });
    },
  });
};
