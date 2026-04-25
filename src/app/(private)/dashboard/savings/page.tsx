import { getAccountSummary } from "@/actions/dashboard";
import { getSavingsTransactions } from "@/actions/transactions";
import SavingsClient from "@/components/Savings/SavingsPage";
import { redirect } from "next/navigation";

const Savings = async () => {
  // const rows = [
  //   {
  //     id: "1",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Success",
  //   },
  //   {
  //     id: "2",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Pending",
  //   },
  //   {
  //     id: "3",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Success",
  //   },
  //   {
  //     id: "4",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Success",
  //   },
  //   {
  //     id: "5",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Success",
  //   },
  //   {
  //     id: "6",
  //     savingsName: "vacation savings",
  //     amountTarget: 200000,
  //     savingsAmount: 50000,
  //     savingsInterest: "12%",
  //     amountDebited: 50000,
  //     dateDebited: "Mon, 21 Dec 2025",
  //     status: "Success",
  //   },
  // ];
  const result = await getAccountSummary();

  if (!result.success) {
    return "Error while fetching account summary";
  }

  if (!result.data.soloSavings) {
    redirect("/dashboard/savings/create");
  }

  const transactions = await getSavingsTransactions(
    result.data.soloSavings.accountNo,
  );

  const accountSummary = result.data;

  const hasSoloAccount = accountSummary.hasSoloAccount;
  const hasTargetSavings = !!accountSummary.targetSavings;
  const hasFamilyVault = !!accountSummary.familyVault;

  const showFundAccountButton =
    hasSoloAccount || hasTargetSavings || hasFamilyVault;

  if (!transactions.success) {
    return (
      <SavingsClient
        rows={[]}
        accountSummary={accountSummary}
        showFundAccountButton={showFundAccountButton}
      />
    );
  }

  return (
    <SavingsClient
      rows={[]}
      accountSummary={accountSummary}
      showFundAccountButton={showFundAccountButton}
    />
  );
};

export default Savings;
