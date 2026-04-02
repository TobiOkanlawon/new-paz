"use server";

import { getAllTransactions } from "@/actions/transactions";
import TargetSaver from "./TargetSaver";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const [accountDetails, transactions] = await Promise.all([
    getAccountSummary(),
    getAllTransactions(),
  ]);

  if (!accountDetails.success) {
    throw new Error("failed to load account");
  }

  if (!transactions.success) {
    throw new Error("failed to get transactions");
  }

  return (
    <TargetSaver
      transactions={transactions.data}
      accountDetails={accountDetails.data}
    />
  );
}
