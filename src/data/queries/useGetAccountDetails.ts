import { axiosInstance as axios } from "@/libs/axios";
import useAccountDetails from "@/store/accountStore";
import { useQuery } from "@tanstack/react-query";

interface AccountDetailsResponse {
  success: boolean;
  message: string;
  accountDetails: TAccountDetails;
}

export const useGetAccountDetails = (email: string) => {
  const { setAccountDetails } = useAccountDetails();
  return useQuery<any, any, TAccountDetails>({
    queryKey: ["account-details"],
    queryFn: async () => {
      return await axios
        .get(`/v1/users/user/account-details?email=${email}`)
        .then((res) => {
          setAccountDetails({
            loanAmount: res.data.accountDetails.TotalLoan,
            savingsAmount: res.data.accountDetails.TotalSavings,
            investmentAmount: res.data.accountDetails.investmentAmount,
          });

          return res.data.accountDetails;
        });
    },
  });
};
