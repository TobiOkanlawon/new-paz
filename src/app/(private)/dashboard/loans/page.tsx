import { getAccountSummary } from "@/actions/dashboard";
import { getPendingLoanRequests, getPendingLoan, getLoanProducts } from "@/actions/loans";
import LoanDashboardClient from "./components/LoanDashboardClient";

const Loan = async () => {
  const [accountSummary, pendingLoanRequests, pendingLoan, loanProducts] = await Promise.all([
    getAccountSummary(),
    getPendingLoanRequests(),
    getPendingLoan(),
    getLoanProducts(),
  ]);

  const activeLoan = pendingLoan.success ? pendingLoan.data.loan : undefined;

  // totalLoan (account-details) is the primary signal, but it isn't always
  // in sync with the loan-pending endpoint's disbursed-loan record, so an
  // active loan record there also counts as having an active loan.
  const hasActiveLoan = accountSummary.success
    ? Boolean(accountSummary.data.totalLoan) || Boolean(activeLoan)
    : Boolean(activeLoan);

  const hasPendingLoanRequest = pendingLoanRequests.success
    ? pendingLoanRequests.data.requests.length > 0
    : false;

  const products = loanProducts.success ? loanProducts.data.products : [];

  return (
    <LoanDashboardClient
      initialHasActiveLoan={hasActiveLoan}
      initialHasPendingLoanRequest={hasPendingLoanRequest}
      initialActiveLoan={activeLoan}
      initialLoanProducts={products}
    />
  );
};

export default Loan;
