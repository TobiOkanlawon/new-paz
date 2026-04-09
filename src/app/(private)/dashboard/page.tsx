"use server";
import { getDashboardData } from "@/actions/dashboard";
import { getTotalBalance } from "@/libs/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllTransactions } from "@/actions/transactions";
import DashboardClient from "./DashboardClient";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const { accountSummary } = await getDashboardData();
  const allTransactionsResult = await getAllTransactions();


  const allTransactions = allTransactionsResult.success
    ? allTransactionsResult.data
    : [];

  if (!accountSummary.success) {
    throw new Error("failed to get account summary");
  }

  // if the transactions data is an array, and if it is more than 1 in length
  const isTransactions = allTransactions && allTransactions.length > 0;

  const firstName = session?.user?.firstName as string;
  const savingsAmount = getTotalBalance(accountSummary.data, "savings");

  const loanAmount = getTotalBalance(accountSummary.data, "loans");

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
      accountSummary={accountSummary}
    />
  );
};

export default Dashboard;
