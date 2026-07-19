import { getAccountSummary } from "@/actions/dashboard";
import LoanDashboardClient from "./components/LoanDashboardClient";

const Loan = async () => {
  const accountSummary = await getAccountSummary();
  const hasActiveLoan = accountSummary.success
    ? Boolean(accountSummary.data.totalLoan)
    : false;

  return <LoanDashboardClient initialHasActiveLoan={hasActiveLoan} />;
};

export default Loan;
