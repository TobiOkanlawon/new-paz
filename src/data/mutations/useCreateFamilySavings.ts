import {useMutation, useQueryClient} from '@tanstack/react-query'
import { axiosInstance as axios } from '@/libs/axios'
import { toast } from 'react-toastify'

type FamilySavingsData = {
  title: string;
  targetAmount: number;
  walletId: string;
  duration: string;
  frequency: string;
  type: "FAMILYVAULT";
};

export const useCreateFamilySavings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-family-savings'],
        mutationFn: async (data: FamilySavingsData) => {
            return await axios.post("/v1/users/user/savings/create-savings", data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['account-details']});
            toast.success("Family savings plan created successfully");
        },
        onError: () => {
            toast.error(
                "An error occured while trying to create target savings plan"
            );
        },
    });
}