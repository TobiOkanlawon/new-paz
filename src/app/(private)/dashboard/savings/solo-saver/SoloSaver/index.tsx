"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../soloSaver.module.css";
import SavingsProgressCard from "@/components/SavingsProgressCard/SavingsProgressCard";
import TransactionsTable, {
  TransactionRow,
} from "@/components/TransactionTable/TransactionTable";
import NoRecord from "@/assets/noRecord.png";
import TopUpSoloSavingsModal from "@/components/TopUpSoloSavingsModal/TopUpSoloSavingsModal";
import WithdrawSoloSavingsModal from "@/components/WithdrawSoloSavingsModal/WithdrawSoloSavingsModal";

import Button from "@/components/Button";
import CreateSoloSaversModal from "@/components/Savings/CreateSavingsModal";
import {
  createSoloSavingsAccount,
  SavingTopupResponse,
} from "@/actions/savings";

import { useSession } from "next-auth/react";
import { createSavingsTopup } from "@/actions/savings";
import TopUpTransferDetailsModal from "@/components/Savings/TopUpDetailsModal/index";
import { toast } from "react-toastify";

// const rows: TransactionRow[] = [
//   {
//     id: "1",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Success",
//   },
//   {
//     id: "2",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Pending",
//   },
//   {
//     id: "3",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Success",
//   },
//   {
//     id: "4",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Success",
//   },
//   {
//     id: "5",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Success",
//   },
//   {
//     id: "6",
//     savingsName: "vacation savings",
//     amountTarget: 200000,
//     savingsAmount: 50000,
//     savingsInterest: "12%",
//     amountDebited: 50000,
//     dateDebited: "Mon, 21 Dec 2025",
//     status: "Success",
//   },
// ];

const rows: TransactionRow[] = [];

type Props = {
  accountDetails: TAccountDetails;
  transactions: TAllTransactions;
};

const SoloSaver: React.FC<Props> = ({ accountDetails, transactions }) => {
  interface Notification {
    id: number;
    message: string;
    time: string;
    amount?: string;
  }

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [isSoloSaverModalOpen, setIsSoloSaverModalOpen] = useState(false);

  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);

  const [transferDetails, setTransferDetails] =
    useState<null | SavingTopupResponse>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleShowSoloSavingsModal = () => {
    setIsSoloSaverModalOpen(true);
  };

  const closeSoloSavingsModal = () => {
    setIsSoloSaverModalOpen(false);
  };

  const hasSoloSaver = accountDetails.hasSoloAccount;

  if (!hasSoloSaver) {
    /* if the user has not yet set up a solo saver page, then we need a screen that shows that and has a quick way to route them to the dashboard/savings/create page. This is a special cas */
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>Solo Saver</h2>
          <p className={styles.headingText}>
            Explore all our savings plans here
          </p>
        </div>
        <div className={styles.buttonContainer}>
          {!accountDetails.hasSoloAccount && (
            <Button 
              onClick={handleShowSoloSavingsModal}
              style={{ whiteSpace: "nowrap" }}
            >
              Create Savings
            </Button>
          )}
          {accountDetails.hasSoloAccount && (
            <>
              <Button
                onClick={() => setOpenWithdraw(true)}
                className={styles.outlineButton}
                variant="outlined2"
              >
                Withdraw Funds
              </Button>
              <Button 
                onClick={() => setShowTopUpModal(true)}
                style={{ whiteSpace: "nowrap" }}
              >
                Top Up Account
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.cardContainer}>
        {hasSoloSaver && accountDetails.soloSavings && (
          <SavingsProgressCard
            name={accountDetails.soloSavings.title}
            accountId={accountDetails.soloSavings.accountNo}
            currentAmount={accountDetails.soloSavings.amount}
            isTarget={false}
            onClick={() => {}}
          />
        )}
      </div>

      {transactions.length ? (
        <div className={styles.bottomContainerNone}>
          <Image
            src={NoRecord}
            alt="No transactions"
            width={154}
            height={140}
          />
        </div>
      ) : (
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
      )}

      {hasSoloSaver && (
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

      {hasSoloSaver && (
        <TopUpSoloSavingsModal
          open={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          accountName={accountDetails.soloSavings.title}
          currentBalance={accountDetails.soloSavings.amount}
          onConfirm={async ({ amount }) => {
            if (!accountDetails?.soloSavings?.accountNo) return;

            setFundLoading(true);

            const result = await createSavingsTopup({
              savingsWallet: accountDetails.soloSavings.accountNo,
              amount,
            });

            setFundLoading(false);

            if (!result.success) {
              toast.error(result.error);
              return;
            }

            setTransferDetails(result.data);
            setShowTransferModal(true);

            // close amount modal
            setShowTopUpModal(false);
          }}
        />
      )}
      {!hasSoloSaver && (
        <CreateSoloSaversModal
          onSubmit={createSoloSavingsAccount}
          isOpen={isSoloSaverModalOpen}
          onClose={() => {
            closeSoloSavingsModal;
          }}
        />
      )}
      {hasSoloSaver && (
        <TopUpTransferDetailsModal
          open={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          data={transferDetails}
        />
      )}
    </div>
  );
};

export default SoloSaver;
