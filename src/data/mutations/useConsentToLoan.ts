import { useMutation } from "@tanstack/react-query"
import {axiosInstance as axios } from '@/libs/axios'

type TConsent = {
  consent: true;
};

const useConsentToLoan = (id: string) => {
  return useMutation({
    mutationKey: ["consent-to-loan"],
    mutationFn: async (data: TConsent) => {
      return await axios.post(`/v1/loan/request/consent/${id}`, data)
    },
  })
}

export default useConsentToLoan;
