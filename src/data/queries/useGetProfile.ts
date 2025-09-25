import { axiosInstance as axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProfile = (email: string) => {
  return useQuery({
    queryKey: ["get-profile"],
    queryFn: () => {
      return axios.post(`/v1/users/user/get-profile?email=${email}`)
    }
  });
};
