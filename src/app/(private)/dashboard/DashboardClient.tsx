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
import TopUpTargetSavingsModal from "@/components/TopUpTargetSavingsModal";

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
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<null | {
    accountNo: string;
    title: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const handleTopUp = () => {
      setShowTopUpModal(true);
  };

  const handleWithdraw = () => {
    setOpenWithdraw(true);
  };

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
              <Piggy
                fill="transparent"
                color="#22C55E"
                height={24}
                width={24}
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
              <QuickActionCard
                action={handleTopUp}
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
              <QuickActionCard
                action={handleWithdraw}
                color="#214CCF"
                backgroundColor="#E9EDFA"
                icon={<WithdrawIcon height={24} width={24} />}
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

      {accounts.targetSavings && (
        <TopUpTargetSavingsModal
          open={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          accountName={selectedAccount?.title || ""}
          currentBalance={
            accounts.targetSavings.find(
              (p: any) => p.accountNo === selectedAccount?.accountNo,
            )?.amount || 0
          }
          remainingToTarget={(() => {
            const plan = accounts.targetSavings.find(
              (p: any) => p.accountNo === selectedAccount?.accountNo,
            );
            return plan ? plan.targetAmount - plan.amount : 0;
          })()}
          fundingSourceTitle="PAZ Wallet"
          fundingSourceBalance={0}
          loading={loading}
          onConfirm={async ({ amount }) => {
            if (!selectedAccount) return;
            setLoading(false);
          }}
        />
      )}
    </>
  );
};

export default DashboardClient;
