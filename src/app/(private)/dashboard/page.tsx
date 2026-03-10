"use client";
import styles from "./dashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Piggy from "@/assets/piggy-bank.svg";
import Plus from "@/assets/plus.svg";
import InvestmentIcon from "@/assets/investments.svg";
// import LoanIcon from "@/assets/wallet.svg";
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
import { useSession } from "next-auth/react";

const BottomLeft = () => {
  return (
    <div className={styles.bottomLeftContainer}>
      <div className={styles.savingsPlan}>
        <div className={styles.savingsPlansTitleContainer}>
          <h2>Savings Plans</h2>
          <Link style={{ color: "#214CCF" }} href="">
            View All
          </Link>
        </div>

        <div className={styles.savingsPlanInnerContainer}>
          <div className={styles.savingsPlanInnerContainerLine}>
            <h3>Solo Savings</h3>
            <div className={styles.miniCards}>
              <SavingsPlanMiniCard
                title="Valentine"
                image={Rose}
                content="Save money daily, bi-weekly plan with a purpose in mind."
                borderColor="#214CCF"
                imageBackgroundColor="#E9EDFA"
              />
              <SavingsPlanMiniCard
                title="Christmas"
                image={Tree}
                content="Save money daily, bi-weekly plan with a purpose in mind."
                borderColor="#22C55E"
                imageBackgroundColor="#EBFFF2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.savingsPlanInnerContainer}>
        <div className={styles.savingsPlanInnerContainerLine}>
          <h3>Target Savings</h3>
          <div className={styles.miniCards}>
            <SavingsPlanMiniCard
              title="Vacation"
              image={Umbrella}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              borderColor="#F7B341"
              imageBackgroundColor="#F9EAD1"
            />
            <SavingsPlanMiniCard
              title="Car"
              image={Car}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              borderColor="#FF06A4"
              imageBackgroundColor="#FED9F0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
            icon={Tree}
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="Christmas"
            backgroundColor="#EBFFF2"
          />
          <InstantSavingsCard
            icon={House}
            title="Target Savers"
            subTitle="SA0799259833"
            secondDescription="House Rent"
            backgroundColor="#F5E5FF"
          />
          <InstantSavingsCard
            icon={Plane}
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

const Dashboard = () => {
  const { data: session } = useSession();
  const [isTransactions] = useState(true);
  const [savingsAmount, setSavingsAmount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      const { accountSummary } = await getDashboardData();

      if (!isMounted) {
        return;
      }

      const amount = accountSummary.success
        ? getTotalBalance(accountSummary.data, "savings")
        : 0;

      setSavingsAmount(amount ?? 0);
    };

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const firstName = session?.user?.firstName as string;
  // const loanAmount = accountSummary.success
  //   ? accountSummary.data?.totalLoans
  //   : 0;
  // const investmentAmount = accountSummary.success
  //   ? accountSummary.data?.totalInvestments
  //   : 0;

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
          icon={Piggy}
          color="#22C55E"
          title="total savings"
          rate={8.5}
          rateBackgroundColor="#DBF8E8"
          rateTextColor="#12B76A"
        />
        {/*<AccountCard
          backgroundColor="#E0DFFD"
          amount={loanAmount ?? 0}
          icon={LoanIcon}
          color="#22C55E"
          title="Total Loans"
          rate={8.5}
          rateBackgroundColor="#DBF8E8"
          rateTextColor="#12B76A"
        />
        <AccountCard
          backgroundColor="#F9EAD1"
          amount={investmentAmount ?? 0}
          icon={InvestmentIcon}
          color="#22C55E"
          title="Total Investments"
          />*/}
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
              icon={Piggy}
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
              icon={WithdrawIcon}
              text="Withdraw Funds"
            />
            <QuickActionCard
              action={() => {}}
              backgroundColor="#EBFFF2"
              icon={Piggy}
              text="Instant Savings"
            />
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
          <BottomLeft />
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
