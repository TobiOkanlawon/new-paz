import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AccountDetailsResponse {
  success: boolean;
  message: string;
  accountDetails: TAccountDetails;
}

export const useGetAccountDetails = (email: string) => {
  return useQuery<AxiosResponse<AccountDetailsResponse>, any, TAccountDetails>({
    queryKey: ["account-details", email],
    queryFn: async () => {
      return await axios
        .get(`/v1/users/user/account-details?email=${email}`)
        .then((res) => {
          return res.data.accountDetails;
        });
    },
  });
};
