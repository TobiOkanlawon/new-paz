import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";


type GetWalletData = {
  currency: string;
  availableBalance: number;
  totalBalance: number;
  lienAmount: number;
  walletId: string;
  accountType: string; // probably an ENUM later on, but values unknown at the moment
};

export const useGetWallet = (email: string) => {
  
return useQuery<any, any, GetWalletData>({
    queryKey: ["get-user-wallet"],
    queryFn: async () => {
      return await axios.get(`/v1/users/user/fetch-account?email=${email}`).then((res) => {
	return res.data.wallet;
      })
    },
  })
}
