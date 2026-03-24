import { getAccountSummary } from "@/actions/dashboard";
import SavingsClient from "@/components/Savings/SavingsPage";
import { toast } from "react-toastify";

const Savings = async () => {
  const rows = [
    {
      id: "1",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "2",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Pending",
    },
    {
      id: "3",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "4",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "5",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
    {
      id: "6",
      savingsName: "vacation savings",
      amountTarget: 200000,
      savingsAmount: 50000,
      savingsInterest: "12%",
      amountDebited: 50000,
      dateDebited: "Mon, 21 Dec 2025",
      status: "Success",
    },
  ];

  const result = await getAccountSummary();

  if (!result.success) {
    return "Error while fetching account summary";
  }

  const accountSummary = result.data;

  const hasSoloAccount = accountSummary.hasSoloAccount;
  const hasTargetSavings = !!accountSummary.targetSavings;
  const hasFamilyVault = !!accountSummary.familyVault;

  const showFundAccountButton =
    hasSoloAccount || hasTargetSavings || hasFamilyVault;

  return (
    <SavingsClient
      rows={rows}
      accountSummary={accountSummary}
      showFundAccountButton={showFundAccountButton}
    />
  );
};

export default Savings;
