// "use client";
// import React, { useState } from "react";
// import styles from "./targetSavings.module.css";
// import TotalBalanceCard from "@/components/TotalBalanceCard";
// import TargetCard from "@/components/TargetCard";
// import Back from "@/components/BackContainer";
// import Button from "@/components/Button";
// import TargetSavingsModal from "@/components/Savings/TargetSavingsModal";
// import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
// import useUser from "@/store/userStore";
// import { Loading } from "@/components/Loading";
// import { ErrorComponent } from "@/components/Error";
// import { addSavings } from "@/libs/helpers";

// const FamilyVault = () => {
//   const { user } = useUser();
//   const { data, isLoading, error } = useGetAccountDetails(
//     user?.email as string,
//   );

//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const showModal = () => setIsModalVisible(true);
//   const closeModal = () => setIsModalVisible(false);

//   if (isLoading) {
//     return <Loading />;
//   }

//   if (error) {
//     return (
//       <ErrorComponent message="An error occurred" retryFunction={() => {}} />
//     );
//   }

//   // this function is after the isLoading block because allPlans is null if the data hasn't loaded
//   const calculateTotal = (allPlans: TTargetSavingsPlan[]) => {
//     return allPlans.reduce((p, c) => p + c.amount, 0);
//   };

//   // Backend sometimes returns `title` instead of `Title`. Normalize to the expected shape.
//   type RawTargetPlan = Partial<TTargetSavingsPlan> & {
//     title?: string;
//     Title?: string;
//   };

//   const targetCards: TTargetSavingsPlan[] = (
//     data!.targetSavings as RawTargetPlan[]
//   ).map((card) => ({
//     Title: card.Title ?? card.title ?? "",
//     description: card.description ?? "",
//     amount: card.amount ?? 0,
//     targetAmount: card.targetAmount ?? 0,
//     accountNo: card.accountNo ?? "",
//   }));

//   return (
//     <div className={styles.container}>
//       <Back />
//       <div className={styles.topContainer}>
//         <div className={styles.topContainerLeft}>
//           <h2 className={styles.header}>PAZ Target Savings</h2>
//           <p className={styles.headingText}>
//             Explore all our savings plans here.
//           </p>
//         </div>
//         <div className={styles.topContainerRight}>
//           <Button onClick={showModal} className="px-8">
//             Create a Target Savings Plan
//           </Button>
//         </div>
//       </div>

//       <TotalBalanceCard
//         header="Total savings balance"
//         money={addSavings(data!).targetSavings}
//       />

//       <div className={styles.cardContainer}>
//         {targetCards.map(
//           ({ Title: title, description, targetAmount, amount, accountNo }) => {
//             return (
//               <TargetCard
//                 key={accountNo}
//                 id={accountNo}
//                 title={title}
//                 description={description}
//                 targetAmount={targetAmount}
//                 amount={amount}
//               />
//             );
//           },
//         )}
//       </div>

//       <TargetSavingsModal
//         isActive={isModalVisible}
//         handleCloseModal={closeModal}
//       />
//     </div>
//   );
// };

// export default FamilyVault;

"use client";
import { useState } from "react";
import styles from "./targetSavings.module.css";
import TransactionsTable, { TransactionRow } from "@/components/TransactionTable/TransactionTable";
import WithdrawTargetSavingsModal from "@/components/WithdrawTargetSavings/WithdrawTargetSavingsModal";
import TargetProgressCard from "@/components/TargetSavingsProgressCard/TargetProgressCard";
import TopUpTargetSavingsModal from "@/components/TopUpTargetSavings";
import MobileActions from "@/components/SoloSaversMobileActions/MobileActions";

const rows: TransactionRow[] = [
  {
    id: "1",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Success",
  },
  {
    id: "2",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Pending",
  },
  {
    id: "3",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Success",
  },
  {
    id: "4",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Success",
  },
  {
    id: "5",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Success",
  },
  {
    id: "6",
    savingsName: "House rent savings",
    amountTarget: 200000,
    savingsAmount: 50000,
    savingsInterest: "12%",
    amountDebited: 50000,
    dateDebited: "Mon, 21 Dec 2025",
    status: "Success",
  },
];


const TargetSavings = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>Target Savings</h2>
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
        <TargetProgressCard
          name="House Rent"
          accountId="SA0799259833"
          currentAmount={5000}
          targetAmount={50000}
          onClick={() => console.log("open savings")}
        />

        {/* <SavingsProgressCard
          name="House Rent"
          accountId="SA0799259833"
          currentAmount={5000}
          targetAmount={50000}
          onClick={() => console.log("open savings")}
        /> */}
      </div>

      <div className={styles.targetSavingsInfo}>
        <p>What is included in the Target Savings</p>
        <ul>
          <li className={styles.lists}>Create a personal target</li>
          <li className={styles.lists}>Lock target to avoid temptation. Funds cannot be accessed until due date</li>
        </ul>
      </div>

      <MobileActions
        setOpenWithdraw={setOpenWithdraw}
        setShowTopUpModal={setShowTopUpModal}
      />

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
      <WithdrawTargetSavingsModal
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        accountName="House Rent Savings"
        currentSavings={100000}
        fundingSourceTitle="PAZ Savings"
        fundingSourceBalance={500000}
        onConfirm={({ amount }) => console.log("Withdraw:", amount)}
      />

      {/* Top Up Modal */}
      <TopUpTargetSavingsModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        accountName="House rent Savings"
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

export default TargetSavings;
