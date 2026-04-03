"use server";
import styles from "./dashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import Piggy from "@/assets/piggy-bank.svg";

import LoanIcon from "@/assets/wallet.svg";
import InvestmentIcon from "@/assets/investments.svg";
import WithdrawIcon from "@/assets/withdraw-icon.svg";
import Rose from "@/assets/noto_rose.svg";
import Tree from "@/assets/noto_christmas-tree.png";
import Umbrella from "@/assets/umbrella.png";
import Car from "@/assets/car.png";
import House from "@/assets/house.png";
import Plane from "@/assets/plane.png";
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

const BottomRight = () => {
  return (
    <div className={styles.bottomRightContainer}>
      <div>
        <div className={styles.recentTransactionsContainer}>
          <div className={styles.recentTransactionsTitleContainer}>
            <h2>Recent Transactions</h2>
            <Link href="#">View All</Link>
          </div>
          <div
            id="#home-bound-recent-transactions-container"
            className={styles.recentTransactionsInnerContainer}
          >
            <RecentTransactionsCard
              title="Payment Received"
              subTitle="From Kelvin Bankole"
              status="inbound"
              amount="N150,000.00"
              date="Today, 2:30 P.M"
            />
            <RecentTransactionsCard
              title="Transfer to Savings"
              subTitle="Monthly Savings"
              status="outbound"
              amount="N100,000.00"
              date="Today, 10:00 A.M"
            />
          </div>
        </div>
      </div>
      <div className={styles.instantSavingsContainer}>
        <div className={styles.instantSavingsTitleContainer}>
          <h2>Instant Savings</h2>
          <Link href="#">View All</Link>
        </div>
        <div className={styles.instantSavingsContainer1}>
          <InstantSavingsCard
            icon={<Piggy color="#22C55E" width={24} height={24} />}
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="Christmas"
            backgroundColor="#EBFFF2"
          />
          <InstantSavingsCard
            icon={<Piggy color="#22C55E" width={24} height={24} />}
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="House Rent"
            backgroundColor="#EBFFF2"
          />
          <InstantSavingsCard
            icon={<Piggy color="#22C55E" width={24} height={24} />}
            title="Family vault"
            subTitle="SA0799259833"
            secondDescription="Relocation"
            backgroundColor="#EBFFF2"
          />
        </div>
      </div>
    </div>
  );
};

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const { accountSummary } = await getDashboardData();
  const allTransactionsResult = await getAllTransactions();

  if (!allTransactionsResult.success) {
    // some error handling, we can just force the empty screen and log the error
  }

  const allTransactions = allTransactionsResult.success
    ? allTransactionsResult.data
    : [];

  // if the transactions data is an array, and if it is more than 1 in length
  const isTransactions = allTransactions && allTransactions.length > 0;

  const firstName = session?.user?.firstName as string;
  const savingsAmount = accountSummary.success
    ? getTotalBalance(accountSummary.data, "savings")
    : 0;

  const loanAmount = accountSummary.success
    ? getTotalBalance(accountSummary.data, "loans")
    : 0;

  const investmentAmount = accountSummary.success
    ? getTotalBalance(accountSummary.data, "investments")
    : 0;

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
          <BottomRight />
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
