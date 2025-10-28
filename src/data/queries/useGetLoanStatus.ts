import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type GetLoanStatusResponse = {
  Amount: number;
  Approved: boolean;
  ApprovedAmount: number;
  Consent: boolean;
  Purpose: string;
  Tenor: string;
};

export const useGetLoanStatus = (walletId: string) => {
  return useQuery<GetLoanStatusResponse, AxiosError, GetLoanStatusResponse>({
    queryKey: ["get-loan-status", walletId],
    queryFn: async () => {
      return await axios
        .get(`/v1/user/loan/pending?walletId=${walletId}`)
        .then((res) => {
          return res.data.data;
        });
    },
    enabled: !!walletId,
  });
};
