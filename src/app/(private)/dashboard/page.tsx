"use client";
import Image, { ImageProps } from "next/image";
import styles from "./dashboard.module.css";
import Link from "next/link";

import Piggy from "@/assets/piggy-bank.svg";
import Plus from "@/assets/plus.svg";
import InvestmentIcon from "@/assets/investments.svg";
import WithdrawIcon from "@/assets/withdraw-icon.svg";
import Rose from "@/assets/noto_rose.svg";
import SavingsPlanMiniCard from "@/components/Savings/SavingsCard";
import AccountCard from "@/components/Dashboard/AccountCard";

import RecentTransactionsCard from "@/components/Dashboard/RecentTransactions";
import InstantSavingsCard from "@/components/Dashboard/InstantSavingsCard";

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
                action={() => {}}
                borderColor="#214CCF"
                imageBackgroundColor="#E9EDFA"
              />
              <SavingsPlanMiniCard
                title="Valentine"
                image={Rose}
                content="Save money daily, bi-weekly plan with a purpose in mind."
                action={() => {}}
                borderColor="#214CCF"
                imageBackgroundColor="#E9EDFA"
              />
              <SavingsPlanMiniCard
                title="Valentine"
                image={Rose}
                content="Save money daily, bi-weekly plan with a purpose in mind."
                action={() => {}}
                borderColor="#214CCF"
                imageBackgroundColor="#E9EDFA"
              />
              <SavingsPlanMiniCard
                title="Valentine"
                image={Rose}
                content="Save money daily, bi-weekly plan with a purpose in mind."
                action={() => {}}
                borderColor="#214CCF"
                imageBackgroundColor="#E9EDFA"
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
              image={Rose}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              action={() => {}}
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
            />
            <SavingsPlanMiniCard
              title="Valentine"
              image={Rose}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              action={() => {}}
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
            />
            <SavingsPlanMiniCard
              title="Valentine"
              image={Rose}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              action={() => {}}
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
            />
            <SavingsPlanMiniCard
              title="Valentine"
              image={Rose}
              content="Save money daily, bi-weekly plan with a purpose in mind."
              action={() => {}}
              borderColor="#214CCF"
              imageBackgroundColor="#E9EDFA"
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
              title="Payment Received"
              subTitle="From Kelvin Bankole"
              status="inbound"
              amount="N150,000.00"
              date="Today, 2:30 P.M"
            />
          </div>
        </div>
      </div>
      <div className={styles.instantSavingsContainer}>
        <div className={styles.instantSavingsTitleContainer}>
          <h2>Instant Savings</h2>
          <Link href="#">View All</Link>
        </div>
        <div className={styles.instantSavingsContainer}>
          <InstantSavingsCard
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="Christmas"
            backgroundColor="#EBFFF2"
          />
          <InstantSavingsCard
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="Christmas"
            backgroundColor="#EBFFF2"
          />
          <InstantSavingsCard
            title="Solo Savers"
            subTitle="SA0799259833"
            secondDescription="Christmas"
            backgroundColor="#EBFFF2"
          />
        </div>
      </div>
    </div>
  );
};

type QuickActionProps = {
  backgroundColor: string;
  action: () => void;
  text: string;
  icon: ImageProps["src"];
  color?: string;
};

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  text,
  backgroundColor,
}) => {
  return (
    <div className={styles.quickActionCardContainer}>
      <div className={styles.quickActionCardInnerContainer}>
        <div
          className={styles.quickActionCardIconContainer}
          style={{ backgroundColor: backgroundColor }}
        >
          <Image src={icon} alt="icon" />
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const firstName = "Esther";
  const savingsAmount = 0;
  const loanAmount = 0;
  const investmentAmount = 0;

  return (
    <div>
      <div>
        <h1 className={styles.firstNameText}>Welcome, {firstName}</h1>
        <p className={styles.subHeadingText}>
          Here is what is happening with your account today
        </p>
      </div>

      <div className={styles.accountCards}>
        <AccountCard
          backgroundColor="#EBFFF2"
          amount={savingsAmount}
          icon={Piggy}
          color="#22C55E"
          title="total savings"
        />
        <AccountCard
          backgroundColor="#EBFFF2"
          amount={savingsAmount}
          icon={Piggy}
          color="#22C55E"
          title="Total Loans"
        />
        <AccountCard
          backgroundColor="#EBFFF2"
          amount={savingsAmount}
          icon={Piggy}
          color="#22C55E"
          title="Total Investments"
        />
      </div>
      <div className={styles.quickActionContainer}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActionCards}>
          <div className={styles.quickActionCardsInnerContainer}>
            <QuickActionCard
              action={() => {}}
              backgroundColor="#E9EDFA"
              icon={Plus}
              text="Apply for a loan"
            />

            <QuickActionCard
              action={() => {}}
              backgroundColor="#EBFFF2"
              icon={Piggy}
              text="Add to Savings"
            />

            <QuickActionCard
              action={() => {}}
              color="#F7B341"
              backgroundColor="#F9EAD1"
              icon={InvestmentIcon}
              text="Invest Now"
            />

            <QuickActionCard
              action={() => {}}
              color="#214CCF"
              backgroundColor="#E9EDFA"
              icon={WithdrawIcon}
              text="Withdraw Funds"
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <BottomLeft />
        <BottomRight />
      </div>
    </div>
  );
};
export default Dashboard;
