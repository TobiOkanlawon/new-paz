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
import AllAccountsModal from "@/components/Savings/AllAccountsModal";
import TopUpTargetSavingsModal from "@/components/TopUpTargetSavingsModal";
import TopUpSoloSavingsModal from "@/components/TopUpSoloSavingsModal/TopUpSoloSavingsModal";
import { toast } from "react-toastify";
import {
  createSavingsTopup,
  createSoloSavingsAccount,
} from "@/actions/savings";
import TopUpTransferDetailsModal from "@/components/Savings/TopUpDetailsModal";

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
  // const [selectedAccount, setSelectedAccount] = useState<null | {
  //   accountNo: string;
  //   title: string;
  // }>(null);
  const [loading, setLoading] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpDetailsModalOpen, setTopUpDetailsModalOpen] = useState(false);
  const [topUpDetails, setTopUpDetails] = useState<{
    accountName: string;
    accountNumber: string;
    bank: { name: string };
    amount: number;
    displayText: string;
  } | null>(null);

  const [selectedAccount, setSelectedAccount] = useState<{
    type: "solo" | "target";
    accountNo: string;
    title: string;
  } | null>(null);

  const handleTopUp = () => {
      setShowTopUpModal(true);
  };

  const handleWithdraw = () => {
    setOpenWithdraw(true);
  };

  const accountDataForModal = () => {
    const a: typeof accountSummary = accountSummary;
    return {
      soloSavings: a.data.hasSoloAccount ? a.data.soloSavings : undefined,
      targetSavings: a.data.targetSavings,
    };
  };

    const handleSelectAccount = (account: {
    type: "solo" | "target";
    accountNo: string;
    title: string;
  }) => {
    setSelectedAccount(account);
    setFundModalOpen(false);
    setTopUpModalOpen(true);
  };

  const handleTopUpConfirm = async ({ amount }: { amount: number }) => {
      if (!selectedAccount) return;
  
      try {
        const result = await createSavingsTopup({
          savingsWallet: selectedAccount.accountNo,
          amount,
        });
  
        if (result.success) {
          setTopUpModalOpen(false);
          setTopUpDetails(result.data);
          setTopUpDetailsModalOpen(true);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
      }
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
                action={()=>setFundModalOpen(true)}
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

      <AllAccountsModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        data={accountDataForModal()}
        onSelect={handleSelectAccount}
      />

      {selectedAccount && (
        <TopUpSoloSavingsModal
          open={topUpModalOpen}
          onClose={() => setTopUpModalOpen(false)}
          accountName={selectedAccount.title}
          currentBalance={
            selectedAccount.type === "solo"
              ? accountSummary.data.soloSavings.amount
              : (accountSummary.data.targetSavings.find(
                  (t: any) => t.accountNo === selectedAccount.accountNo,
                )?.amount ?? 0)
          }
          loading={fundLoading}
          onConfirm={handleTopUpConfirm}
        />
      )}

      {/* {accounts.targetSavings && (
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
      )} */}
    </>
  );
};

export default DashboardClient;
