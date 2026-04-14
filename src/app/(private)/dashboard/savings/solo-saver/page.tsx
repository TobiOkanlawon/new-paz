"use server";

import {
  // getAllTransactions,
  getSavingsTransactions,
} from "@/actions/transactions";
import SoloSaver from "./SoloSaver";
import { redirect } from "next/navigation";
import { getAccountSummary } from "@/actions/dashboard";

export default async function Page() {
  const accountDetails = await getAccountSummary();

  if (!accountDetails.success) {
    throw new Error("failed to load account");
  }

  if (accountDetails.data.hasSoloAccount) {
    const transactions = await getSavingsTransactions(
      accountDetails.data.soloSavings.accountNo,
    );

    if (!transactions.success) {
      return (
        <SoloSaver transactions={[]} accountDetails={accountDetails.data} />
      );
    }
    return (
      <SoloSaver
        transactions={transactions.data}
        accountDetails={accountDetails.data}
      />
    );
  } else {
    redirect("/dashboard/savings/create");
  }
}
