import { useMutation } from "@tanstack/react-query";
import { submitLoanConsent } from "@/actions/loans";

type TConsent = {
  consent: boolean;
};

// Calls the submitLoanConsent server action rather than posting to the
// backend directly from the browser — same reasoning as
// useGetPendingLoanRequests: server actions run server-to-server and aren't
// subject to the backend's browser CORS policy.
const useConsentToLoan = (id: string) => {
  return useMutation({
    mutationKey: ["consent-to-loan"],
    mutationFn: async (data: TConsent) => {
      const result = await submitLoanConsent({ loanId: id, consent: data.consent });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export default useConsentToLoan;
