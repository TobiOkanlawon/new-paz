"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InstantSavingsCard from "@/components/Dashboard/InstantSavingsCard";
import styles from "@/app/(private)/dashboard/dashboard.module.css";
import RecentTransactionsCard from "../RecentTransactions";
import Piggy from "@/assets/piggy-bank.svg";

type BottomRightProps = {
  /* transactions is a slice of all transactions, currently limited to 2. */
  transactions: TAllTransactions;
  savingsAccounts: {
    soloSavings: SoloSavings;
    targetSavings: TTargetSavingsPlan[];
  };
};

function formatDate(input: string) {
  const date = new Date(input);

  const now = new Date();

  // Helper: check if same day
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Helper: ordinal suffix (1st, 2nd, 3rd, etc.)
  function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Format time (12-hour with A.M / P.M)
  function formatTime(d: Date) {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "P.M" : "A.M";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
  }

  const timePart = formatTime(date);

  if (isToday) {
    return `Today, ${timePart}`;
  }

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${weekday} ${day} ${month} ${year}, ${timePart}`;
}

/*
Some weird transformation has to happen with transactions to have the correct effect. for example, we need to get the title, and that's weird because transactions don't have titles, so we'll need to construct one for it.
 */

const BottomRight: React.FC<BottomRightProps> = ({
  transactions,
  savingsAccounts,
}) => {
  type CustomTransactionType = {
    id: string;
    title: string;
    type: "outbound" | "inbound";
    // the subtitle is something like, "into {{savings plans name}}"
    subTitle: string;
    currency: string;
    // amount is also already properly formatted with the currency and appropriate commas
    amount: string;
    // the date is human-readable, like "Today, 10:00AM"
    date: string;
  };

  const router = useRouter();

  const routeToSoloSavings = () => {
    router.push("/dashboard/savings/solo-saver");
  };

  const routeToTargetSavings = () => {
    router.push("/dashboard/savings/target-savings");
  };

  // then we'll also need to enforce the currency to be capital and acceptable.
  // right now, there's the possibility for a bug in the future here, but I do not know how to stop it.
  // if the backend adds a new currency that isn't recognized by this formatter, then it'll probably break.
  const constructCustomTransactionsData = (
    tx: Transaction,
  ): CustomTransactionType => {
    const amount = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: tx.currency,
    }).format(tx.amount);

    // basically
    const subTitle = "Into savings";
    let type: "inbound" | "outbound" = "inbound";

    if (tx.description == "VirtualAccountTopUp") {
      type = "inbound";
    }

    return {
      id: String(tx.id),
      amount: amount,
      currency: tx.currency,
      title: "Payment into savings",
      subTitle: subTitle,
      type: type || "inbound", // for now, we'll make them all inbound
      // there's also the minor assumption that the createdAt date is the same as when the transaction happened, which, for most cases, should hold
      date: formatDate(tx.createdAt),
    };
  };

  return (
    <div className={styles.bottomRightContainer}>
      <div>
        {transactions && (
          <div className={styles.recentTransactionsContainer}>
            <div className={styles.recentTransactionsTitleContainer}>
              <h2>Recent Transactions</h2>
              <Link style={{ display: "none" }} href="#">
                View All
              </Link>
            </div>
            {transactions && (
              <div
                id="#home-bound-recent-transactions-container"
                className={styles.recentTransactionsInnerContainer}
              >
                {transactions.slice(0, 2).map((t) => {
                  const tx = constructCustomTransactionsData(t);
                  return (
                    <RecentTransactionsCard
                      title={tx.title}
                      subTitle={tx.subTitle}
                      status={tx.type}
                      amount={tx.amount}
                      date={tx.date}
                      key={tx.id}
                    />
                  );
                })}
                {/*<RecentTransactionsCard
                title="Transfer to Savings"
                subTitle="Monthly Savings"
                status="outbound"
                amount="N100,000.00"
                date="Today, 10:00 A.M"
                />*/}
              </div>
            )}
          </div>
        )}
      </div>
      {savingsAccounts && (
        <div className={styles.instantSavingsContainer}>
          <div className={styles.instantSavingsTitleContainer}>
            <h2>Instant Savings</h2>
            <Link style={{ display: "none" }} href="#">
              View All
            </Link>
          </div>
          <div className={styles.instantSavingsContainer1}>
            {savingsAccounts.soloSavings && (
              <InstantSavingsCard
                icon={<Piggy color="#22C55E" width={24} height={24} />}
                title={savingsAccounts.soloSavings.title}
                subTitle={savingsAccounts.soloSavings.accountNo}
                secondDescription="Solo Savings"
                backgroundColor="#EBFFF2"
                onClick={() => routeToSoloSavings()}
              />
            )}
            {savingsAccounts.targetSavings
              .slice(0, 2)
              .map((plan: TTargetSavingsPlan) => {
                return (
                  <InstantSavingsCard
                    key={plan.accountNo}
                    icon={<Piggy color="#22C55E" width={24} height={24} />}
                    title={plan.title}
                    subTitle={plan.accountNo}
                    secondDescription="Target Savings"
                    backgroundColor="#EBFFF2"
                    onClick={() => routeToTargetSavings()}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomRight;
