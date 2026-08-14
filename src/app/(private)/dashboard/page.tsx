"use server";
import { getDashboardData } from "@/actions/dashboard";
import { getPendingLoan } from "@/actions/loans";
import { getTotalBalance } from "@/libs/helpers";
import { getServerSession } from "next-auth";

import DashboardClient from "./components/dashboard";
import { getAllTransactions } from "@/actions/transactions";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const [{ accountSummary }, allTransactionsResult, pendingLoan] =
    await Promise.all([
      getDashboardData(),
      getAllTransactions(),
      getPendingLoan(),
    ]);

  console.log("Account Summary: ", accountSummary);
  const allTransactions = allTransactionsResult.success
    ? allTransactionsResult.data
    : [];

  if (!accountSummary?.success) {
    throw new Error("failed to get account summary");
  }

  // if the transactions data is an array, and if it is more than 1 in length
  const isTransactions = allTransactions && allTransactions.length > 0;

  const firstName = session?.user?.firstName as string;
  const savingsAmount = getTotalBalance(accountSummary.data, "savings");


  // totalLoan (account-details) isn't always in sync with the loan-pending
  // endpoint's disbursed-loan record, so fall back to that when it's 0.
  const activeLoan = pendingLoan.success ? pendingLoan.data.loan : undefined;
  let loanAmount =
  getTotalBalance(accountSummary.data, "loans") ||
  // activeLoan?.AmountDisbursed ||
  0;
  if (activeLoan){
    loanAmount = activeLoan?.TotalPayable - activeLoan?.AmountLiquidated;
  }
  
  const investmentAmount = getTotalBalance(accountSummary.data, "investments");

  const accounts = {
    soloSavings: accountSummary.data.soloSavings,
    targetSavings: accountSummary.data.targetSavings,
  };

  return (
    <DashboardClient
      firstName={firstName}
      savingsAmount={savingsAmount}
      loanAmount={loanAmount}
      investmentAmount={investmentAmount}
      isTransactions={isTransactions}
      accounts={accounts}
      allTransactions={allTransactions}
      accountDetails={accountSummary.data}
    />
  );
};

export default Dashboard;
