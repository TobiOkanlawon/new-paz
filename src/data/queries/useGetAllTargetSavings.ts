import { useQuery } from '@tanstack/react-query';
import { axiosInstance as axios } from "@/libs/axios";

export const useGetTargetSavings = () => {
  return useQuery({
    queryKey: ['target-savings'],
    queryFn: () => {},
  });
};

export default useGetTargetSavings;
