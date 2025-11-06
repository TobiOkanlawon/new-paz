"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import Back from "@/components/BackContainer";
import FamilyVaultCards from "@/components/FamilyCard";
import Button from "@/components/Button";
import FamilyVaultModal from "@/components/Savings/FamilyVaultModal";
import useUser from "@/store/userStore";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";
import RecentActivity from "@/components/Shared/RecentActivity";

const FamilyVault = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );
  }

  const calculateTotal = (allPlans: TTargetSavingsPlan[]) => {
    return allPlans.reduce((p, c) => p + c.amount, 0);
  };

  const families: any[] = (data!.targetSavings as any[]).map((card) => ({
    ...card,
    Title: card.Title || card.title,
  }));
  const [showMoney, setShowMoney] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleToggle = () => setShowMoney((prev) => !prev);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );

  return (
    <div className={styles.container}>
      <Back />
      <div className={styles.topContainer}>
        <div className={styles.topContainerLeft}>
          <h2 className={styles.header}>PAZ Family Vault</h2>
          <p className={styles.headingText}>
            Explore all your family vault savings plans here.
          </p>
        </div>
        <div className={styles.topContainerRight}>
          <Button onClick={showModal} className="px-8">
            Create a Family Vault Plan
          </Button>
        </div>
      </div>

      <div className={styles.cardContainers}>
        <TotalBalanceCard
          header="Total savings balance"
          money={calculateTotal(families)}
        />

        <FamilyVaultModal
          isActive={isModalVisible}
          handleCloseModal={closeModal}
        />
      </div>

      <div className={styles.notificationContainer}>
        <RecentActivity />
      </div>
    </div>
  );
};

export default FamilyVault;

// {isWithdrawModalOpen && (
//         <Modal isOpen={isWithdrawModalOpen} onClose={handleCloseWithdrawModal}>
//           <WithdrawModal onSubmit={handleWithdrawSubmit} />
//         </Modal>
//       )}

//       {isHelloWorldModalOpen && (
//         <Modal
//           isOpen={isHelloWorldModalOpen}
//           onClose={handleCloseHelloWorldModal}
//         >
//           <div className={styles.modalContainer}>
//             <h2>Withdrawal Consent</h2>
//             <p>
//               We will send a withdrawal request consent to other members of the
//               Olowo family before sending the fund to you. You can inform the
//               other family members to fast-track the process.
//             </p>
//             <button>{"Continue"}</button>
//           </div>
//         </Modal>
//       )}
