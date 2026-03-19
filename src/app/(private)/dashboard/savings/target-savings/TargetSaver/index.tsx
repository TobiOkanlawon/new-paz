"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../targetSavings.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import NotificationContainer from "@/components/NotificationContainer";
import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import Back from "@/components/BackContainer";
import Notifications from "@/components/Notifications";
import useUser from "@/store/userStore";
import SavingsProgressCard from "@/components/SavingsProgressCard/SavingsProgressCard";
import TransactionsTable, {
  TransactionRow,
} from "@/components/TransactionTable/TransactionTable";
import WithdrawSoloSavingsModal from "@/components/WithdrawSoloSavingsModal/WithdrawSoloSavingsModal";
import TopUpTargetSavingsModal from "@/components/TopUpTargetSavingsModal";
import Link from "next/link";
import Button from "@/components/Button";

const rows: TransactionRow[] = [
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

const TargetSaver = ({ accountDetails }) => {
  interface Notification {
    id: number;
    message: string;
    time: string;
    amount?: string;
  }

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Backend sometimes returns `title` instead of `Title`. Normalize to the expected shape.
  type RawTargetPlan = Partial<TTargetSavingsPlan> & {
    title?: string;
    Title?: string;
  };

  // const accountDetails: TAccountDetails =
  //   data ??
  //   ({
  //     totalLoan: 0,
  //     familyVault: [],
  //     hasSoloAccount: false,
  //     soloSavings: { AccountNo: "", Amount: 0 },
  //     targetSavings: [],
  //     firstName: "",
  //     investmentAmount: 0,
  //     lastName: "",
  //     userName: "",
  //   } as TAccountDetails);

  // const targetCards: TTargetSavingsPlan[] = (
  //   accountDetails.targetSavings as RawTargetPlan[]
  // ).map((card) => ({
  //   Title: card.Title ?? card.title ?? "",
  //   description: card.description ?? "",
  //   amount: card.amount ?? 0,
  //   targetAmount: card.targetAmount ?? 0,
  //   accountNo: card.accountNo ?? "",
  // }));

  console.log("targetSavings: ", accountDetails.targetSavings);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>Target Savers</h2>
          <p className={styles.headingText}>
            Explore all our savings plans here
          </p>
        </div>
        <div className={styles.buttonContainer}>
          {!accountDetails.targetSavings.length && (
            <Link href="/dashboard/savings/create">
              <Button>Create Savings Plan</Button>
            </Link>
          )}
          {accountDetails.targetSavings.length > 0 && (
            <>
              <Button
                onClick={() => setOpenWithdraw(true)}
                style={{
                  backgroundColor: "transparent",
                  color: "#214CCF",
                  border: "1px solid #214CCF",
                }}
              >
                Withdraw Funds
              </Button>
              <Button onClick={() => setShowTopUpModal(true)}>
                Top Up Account
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.cardContainer}>
        {accountDetails.targetSavings.length > 0 &&
          accountDetails.targetSavings.map((plan) => {
            return (
              <SavingsProgressCard
                name={plan.title}
                accountId={plan.accountNo}
                currentAmount={plan.amount}
                targetAmount={plan.targetAmount}
                onClick={() => console.log("open savings")}
              />
            );
          })}
      </div>

      {/* <div className={styles.activities}>
        <Notifications
          header="Recent activities"
          notifications={notifications}
        />
      </div>
      {isActive && (
        <Modal isOpen={isActive} onClose={handleCloseModal}>
          {<WithdrawModal />}
        </Modal>
      )} */}
      <TransactionsTable
        rows={rows}
        total={20}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        leftControls={
          <select
            style={{
              height: 34,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 10px",
            }}
          >
            <option>Transaction status</option>
            <option>Success</option>
            <option>Pending</option>
          </select>
        }
        rightControls={
          <>
            <button
              style={{
                height: 34,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              Filters
            </button>
            <button
              style={{
                height: 34,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                padding: "0 10px",
                background: "#fff",
              }}
            >
              Wed, 3 Sept, 2024 - Sat, 5 Sept, 2024
            </button>
          </>
        }
      />

      {/* Withdraw Modal */}
      <WithdrawSoloSavingsModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        accountName="Valentine Savings"
        currentSavings={100000}
        fundingSourceTitle="PAZ Savings"
        fundingSourceBalance={500000}
        onConfirm={({ amount }) => console.log("Withdraw:", amount)}
      />

      {/* Top Up Modal */}
      {/*<TopUpTargetSavingsModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        accountName="Target Savings Plan"
        currentBalance={selectedPlan.amount}
        remainingToTarget={selectedPlan.targetAmount - selectedPlan.amount}
        fundingSourceTitle="PAZ Wallet" // This could also come from accountDetails
        fundingSourceBalance={accountDetails.walletBalance || 0}
        loading={isSubmitting}
        onConfirm={handleTopUpConfirm}
        />*/}
    </div>
  );
};

export default TargetSaver;
