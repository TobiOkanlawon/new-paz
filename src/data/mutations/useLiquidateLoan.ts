import { useMutation } from "@tanstack/react-query";
import { liquidateLoan } from "@/actions/loans";

// Calls the liquidateLoan server action rather than posting to the backend
// directly from the browser, same reasoning as useConsentToLoan: server
// actions run server-to-server and aren't subject to the backend's browser
// CORS policy.
const useLiquidateLoan = () => {
  return useMutation({
    mutationKey: ["liquidate-loan"],
    mutationFn: async (amount: number) => {
      const result = await liquidateLoan(amount);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export default useLiquidateLoan;
