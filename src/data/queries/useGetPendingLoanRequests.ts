import { useQuery } from "@tanstack/react-query";
import { getPendingLoanRequests, PendingLoanData } from "@/actions/loans";

// A bare numeric OtherInfo (no "PREFIX-" step token) means the request has
// finished the application steps and OtherInfo now holds the real loan id.
export const isFinalizedLoanId = (otherInfo: string | undefined | null) =>
  !!otherInfo && /^\d+$/.test(otherInfo);

// Uses the getPendingLoanRequests server action rather than calling the
// backend directly from the browser: the action resolves walletId from the
// session server-side (no client-side wallet lookup needed) and, since it
// runs server-to-server, isn't subject to the backend's browser CORS policy
// the way a client axios call to it would be.
export const useGetPendingLoanRequests = () => {
  return useQuery<PendingLoanData[]>({
    queryKey: ["get-pending-loan-requests"],
    queryFn: async () => {
      const result = await getPendingLoanRequests();
      return result.success ? result.data.requests : [];
    },
    refetchInterval: 15000,
  });
};
