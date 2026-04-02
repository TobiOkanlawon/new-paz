"use server";

import { getAllTransactions } from "@/actions/transactions";
import SoloSaver from "./SoloSaver";
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
    <SoloSaver
      transactions={transactions.data}
      accountDetails={accountDetails.data}
    />
  );
}
