"use server";
import styles from "./dashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import Piggy from "@/assets/piggy-bank.svg";

import LoanIcon from "@/assets/wallet.svg";
import InvestmentIcon from "@/assets/investments.svg";
import WithdrawIcon from "@/assets/withdraw-icon.svg";
import Rose from "@/assets/noto_rose.svg";
import NoRecord from "@/assets/noRecord.png";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";
import AccountCard from "@/components/Dashboard/AccountCard";
import RecentTransactionsCard from "@/components/Dashboard/RecentTransactions";
import InstantSavingsCard from "@/components/Dashboard/InstantSavingsCard";
import { getDashboardData } from "@/actions/dashboard";
import QuickActionCard from "@/components/Dashboard/QuickActionCard";
import { getTotalBalance } from "@/libs/helpers";
import BottomLeft from "@/components/Dashboard/BottomLeft";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getAllTransactions } from "@/actions/transactions";
import BottomRight from "@/components/Dashboard/BottomRight";

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
    <div className={styles.container}>
      <div>
        <h1 className={styles.firstNameText}>Welcome, {firstName}</h1>
        <p className={styles.subHeadingText}>
          Here is what is happening with your account today
        </p>
      </div>

      <div className={styles.accountCards}>
        <AccountCard
          backgroundColor="#EBFFF2"
          amount={savingsAmount ?? 0}
          icon={
            <Piggy fill="transparent" color="#22C55E" height={24} width={24} />
          }
          iconColor="#22C55E"
          title="total savings"
          rateBackgroundColor="#DBF8E8"
          rateTextColor="#12B76A"
        />
        <AccountCard
          backgroundColor="#E0DFFD"
          amount={loanAmount ?? 0}
          icon={<LoanIcon color="#4F46E5" height={24} width={24} />}
          iconColor="#22C55E"
          title="Total Loans (COMING SOON)"
          rateBackgroundColor="#DBF8E8"
          rateTextColor="#12B76A"
        />
        <AccountCard
          backgroundColor="#F9EAD1"
          amount={investmentAmount ?? 0}
          icon={<InvestmentIcon color="#F7B341" height={24} width={24} />}
          iconColor="#22C55E"
          title="Total Investments (COMING SOON)"
        />
      </div>

      <div className={styles.quickActionContainer}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActionCards}>
          <div className={styles.quickActionCardsInnerContainer}>
            {/*<QuickActionCard
              action={() => {}}
              backgroundColor="#E9EDFA"
              icon={Plus}
              text="Apply for a loan"
              />*/}
            <QuickActionCard
              action={() => {}}
              backgroundColor="#EBFFF2"
              icon={
                <Piggy
                  fill="transparent"
                  color="#22C55E"
                  height={24}
                  width={24}
                />
              }
              text="Add to Savings"
            />
            {/*<QuickActionCard
              action={() => {}}
              color="#F7B341"
              backgroundColor="#F9EAD1"
              icon={InvestmentIcon}
              text="Invest Now"
              />*/}
            <QuickActionCard
              action={() => {}}
              color="#214CCF"
              backgroundColor="#E9EDFA"
              icon={<WithdrawIcon height={24} width={24} />}
              text="Withdraw Funds"
            />
            {/*<QuickActionCard
              action={() => {}}
              backgroundColor="#EBFFF2"
              icon={
                <Piggy
                  fill="transparent"
                  color="#22C55E"
                  height={24}
                  width={24}
                />
              }
              text="Instant Savings"
            />*/}
          </div>
        </div>
        <div className={styles.quickActionPager} aria-hidden="true">
          <span
            className={`${styles.quickActionDot} ${styles.quickActionDotActive}`}
          />
          <span className={styles.quickActionDot} />
        </div>
      </div>

      {isTransactions ? (
        <div className={styles.bottomContainer}>
          <BottomLeft showSoloSavings={!accountSummary.data?.hasSoloAccount} />
          <BottomRight
            savingsAccounts={accounts}
            transactions={allTransactions}
          />
        </div>
      ) : (
        <div className={styles.bottomContainerNone}>
          <Image
            src={NoRecord}
            alt="No transactions"
            width={124}
            height={120}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
