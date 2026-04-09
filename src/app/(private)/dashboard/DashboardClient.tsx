"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./dashboard.module.css";
import Piggy from "@/assets/piggy-bank.svg";
import LoanIcon from "@/assets/wallet.svg";
import InvestmentIcon from "@/assets/investments.svg";
import WithdrawIcon from "@/assets/withdraw-icon.svg";
import NoRecord from "@/assets/noRecord.png";
import AccountCard from "@/components/Dashboard/AccountCard";
import QuickActionCard from "@/components/Dashboard/QuickActionCard";
import BottomLeft from "@/components/Dashboard/BottomLeft";
import BottomRight from "@/components/Dashboard/BottomRight";
import WithdrawSoloSavingsModal from "@/components/WithdrawSoloSavingsModal/WithdrawSoloSavingsModal";
import FundAccountFlow from "@/components/Savings/FundAccountFlow";

interface DashboardClientProps {
  firstName: string;
  savingsAmount: number;
  loanAmount: number;
  investmentAmount: number;
  isTransactions: boolean;
  accounts: any;
  allTransactions: any[];
  accountSummary: any;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  firstName,
  savingsAmount,
  loanAmount,
  investmentAmount,
  isTransactions,
  accounts,
  allTransactions,
  accountSummary,
}) => {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = () => {
    setOpenWithdraw(true);
  };

  // console.log("Account summary", accountSummary)

  return (
    <>
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
              <Image
                src={Piggy}
                alt="Dashboard"
                className={styles.sidebarIcon}
                width={24}
                height={24}
              />
            }
            iconColor="#22C55E"
            title="total savings"
            rateBackgroundColor="#DBF8E8"
            rateTextColor="#12B76A"
          />
          <AccountCard
            backgroundColor="#E0DFFD"
            amount={loanAmount ?? 0}
            icon={<Image
              src={LoanIcon}
              alt="Dashboard"
              className={styles.sidebarIcon}
              width={24}
              height={24}
            />}
            iconColor="#22C55E"
            title="Total Loans (COMING SOON)"
            rateBackgroundColor="#DBF8E8"
            rateTextColor="#12B76A"
          />
          <AccountCard
            backgroundColor="#F9EAD1"
            amount={investmentAmount ?? 0}
            icon={<Image
              src={InvestmentIcon}
              alt="Dashboard"
              className={styles.sidebarIcon}
              width={24}
              height={24}
            />}
            iconColor="#22C55E"
            title="Total Investments (COMING SOON)"
          />
        </div>

        <FundAccountFlow
          accountSummary={accountSummary.data}
          onCompleted={() => {
            // Optional: Handle completion if needed
          }}
        >
          {(openFundModal) => (
            <div className={styles.quickActionContainer}>
              <h2>Quick Actions</h2>
              <div className={styles.quickActionCards}>
                <div className={styles.quickActionCardsInnerContainer}>
                  <QuickActionCard
                    action={openFundModal}
                    backgroundColor="#EBFFF2"
                    icon={
                      <Image
                        src={Piggy}
                        alt="Dashboard"
                        className={styles.sidebarIcon}
                        width={24}
                        height={24}
                      />
                    }
                    text="Add to Savings"
                  />
                  <QuickActionCard
                    action={handleWithdraw}
                    color="#214CCF"
                    backgroundColor="#E9EDFA"
                    icon={
                      <Image
                        src={WithdrawIcon}
                        alt="Dashboard"
                        className={styles.sidebarIcon}
                        width={24}
                        height={24}
                      />
                    }
                    text="Withdraw Funds"
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
          )}
        </FundAccountFlow>

        {isTransactions ? (
          <div className={styles.bottomContainer}>
            <BottomLeft
              showSoloSavings={!accountSummary.data?.hasSoloAccount}
            />
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

      {accounts.targetSavings && (
        <WithdrawSoloSavingsModal
          open={openWithdraw}
          onClose={() => setOpenWithdraw(false)}
          accountName="Valentine Savings"
          currentSavings={100000}
          fundingSourceTitle="PAZ Savings"
          fundingSourceBalance={500000}
          onConfirm={({ amount }) => console.log("Withdraw:", amount)}
        />
      )}
    </>
  );
};

export default DashboardClient;
