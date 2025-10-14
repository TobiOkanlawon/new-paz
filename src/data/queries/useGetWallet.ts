import { axiosInstance as axios } from "@/libs/axios";
import { useWallet } from "@/store/walletStore";
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

  const { setWalletInformation, walletInformation } = useWallet()
  
return useQuery<any, any, GetWalletData>({
    queryKey: ["get-user-wallet"],
    queryFn: async () => {
      return await axios.get(`/v1/users/user/fetch-account?email=${email}`).then((res) => {
	setWalletInformation(res.data.wallet);
	return res.data.wallet;
      })
    },
    enabled: !walletInformation?.walletId
  })
}
