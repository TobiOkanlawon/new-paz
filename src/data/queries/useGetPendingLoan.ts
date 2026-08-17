import { useQuery } from "@tanstack/react-query";
import { getPendingLoan, ActiveLoanData } from "@/actions/loans";

// Uses the getPendingLoan server action rather than calling the backend
// directly from the browser, same reasoning as useGetPendingLoanRequests:
// the action resolves walletId server-side and isn't subject to the
// backend's browser CORS policy.
export const useGetPendingLoan = () => {
  return useQuery<ActiveLoanData | null>({
    queryKey: ["get-pending-loan"],
    queryFn: async () => {
      const result = await getPendingLoan();
      return result.success ? result.data.loan ?? null : null;
    },
    refetchInterval: 30000,
  });
};
