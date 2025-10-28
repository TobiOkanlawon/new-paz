import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type GetWalletData = {
  currency: string;
  availableBalance: number;
  totalBalance: number;
  lienAmount: number;
  walletId: string;
  accountType: string; // probably an ENUM later on, but values unknown at the moment
};

export const useGetWallet = (email: string) => {
  return useQuery<GetWalletData, AxiosError, GetWalletData>({
    queryKey: ["get-user-wallet", email],
    queryFn: async () => {
      return await axios.get(`/v1/users/user/fetch-account?email=${email}`).then((res) => {
        return res.data.wallet;
      });
    },
    enabled: !!email,
  });
}
