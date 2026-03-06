"use client";
import { useState } from "react";
import styles from "./soloSaver.module.css";
import SavingsProgressCard from "@/components/SavingsProgressCard/SavingsProgressCard";
import TransactionsTable, { TransactionRow } from "@/components/TransactionTable/TransactionTable";
import TopUpSoloSavingsModal from "@/components/TopUpSoloSavingsModal/TopUpSoloSavingsModal";
import WithdrawSoloSavingsModal from "@/components/WithdrawSoloSavingsModal/WithdrawSoloSavingsModal";
import MobileActions from "@/components/SoloSaversMobileActions/MobileActions";

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


const SoloSaver = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>Solo Savers</h2>
          <p className={styles.headingText}>
            Explore all our savings plans here
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={() => setOpenWithdraw(true)} className={styles.widFunds}>
            Withdraw Funds
          </button>
          <button onClick={() => setShowTopUpModal(true)} className={styles.topUpFunds}>
            Top Up Account
          </button>
        </div>
      </div>

      {/* <div>
        <TotalBalanceCard
          money={0}
          header="PAZ saver balance"
          buttonText="Instant top-up "
          modalContent={<TopUpModal />}
        />
      </div> */}
      <div className={styles.cardContainer}>
        <SavingsProgressCard
          name="Valentine"
          accountId="SA0799259833"
          currentAmount={5000}
          targetAmount={50000}
          onClick={() => console.log("open savings")}
        />
      </div>

      <MobileActions
        setOpenWithdraw={setOpenWithdraw}
        setShowTopUpModal={setShowTopUpModal}
      />

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
        showFilter={false}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        leftControls={
          <select className={styles.tableStatusSelect}>
            <option>Transaction status</option>
            <option>Success</option>
            <option>Pending</option>
          </select>
        }
        rightControls={
          <button className={styles.tableDateButton}>
            3/09/2025 - 3/10/2025
          </button>
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
      <TopUpSoloSavingsModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        accountName="Solo Savings"
        currentBalance={5000}
        remainingToTarget={45000}
        fundingSourceTitle="PAZ Wallet"
        fundingSourceBalance={150000}
        onConfirm={async ({ amount }) => {
          console.log("Top up amount:", amount);
          setShowTopUpModal(false);
        }}
      />
    </div>
  );
};

export default SoloSaver;
