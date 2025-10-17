import { useMutation } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/libs/axios";
import { toast } from "react-toastify";

type TargetSavingsData = {
  title: string;
  description: string;
  currentAmount: number;
  walletId: string;
  duration: string;
  targetAmount: number;
  frequency: "Yearly" | "Monthly";
  type: "TARGETSAVINGS";
};

/*{{
    "title":"PERSONAL",
  "description":"saving for rent",
    "currentAmount":0.0,
    "walletId":"0756586993",
    "duration":"6 months",
    "targetAmount":1000000,
    "frequency":"Yearly",
    "type":"TARGET"
}
*/

export const useCreateTargetSavings = () => {
  return useMutation({
    mutationKey: ["create-target-savings"],
    mutationFn: async (data: TargetSavingsData) => {
      return await axios.post("/v1/users/user/savings/create-savings", data);
    },

    onSuccess: () => {
      toast.success("Target savings plan created successfully");
    },

    onError: () => {
      toast.success(
        "An error occured while trying to create target savings plan",
      );
    },
  });
};
