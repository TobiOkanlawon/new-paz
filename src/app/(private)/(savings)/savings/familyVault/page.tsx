"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import WithdrawModal from "@/components/WithdrawModal";
import TotalFamilyCard from "@/components/TotalFamilyCard";
import Back from "@/components/BackContainer";
import Notifications from "@/components/Notifications";

const FamilyVault = () => {
  interface Notification {
    id: string;
    message: string;
    time: string;
    amount?: string;
  }


  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isHelloWorldModalOpen, setIsHelloWorldModalOpen] = useState(false);

  const handleOpenWithdrawModal = () => setIsWithdrawModalOpen(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalOpen(false);

  const handleOpenHelloWorldModal = () => setIsHelloWorldModalOpen(true);
  const handleCloseHelloWorldModal = () => setIsHelloWorldModalOpen(false);

  // Callback for WithdrawModal submit
  const handleWithdrawSubmit = () => {
    setIsWithdrawModalOpen(false);
    setIsHelloWorldModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Back />
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>Olowo Family</h2>
          <p className={styles.headingText}>Monthly food saving quota</p>
        </div>
        <div>
          <button onClick={handleOpenWithdrawModal} className={styles.widFunds}>
            Withdraw Funds
          </button>
        </div>
      </div>

      <div className={styles.cardContainers}>
        <TotalBalanceCard
          header="PAZ saver balance"
          buttonText="Instant top-up "
          modalContent={<TopUpModal />}
        />
        <TotalFamilyCard header="Family Members" buttonText="Add new members" />
      </div>

      <div className={styles.notificationContainer}>
      <Notifications header="Recent activity" />
      </div>
      {isWithdrawModalOpen && (
        <Modal
          isOpen={isWithdrawModalOpen}
          onClose={handleCloseWithdrawModal}
        >
          <WithdrawModal onSubmit={handleWithdrawSubmit} />
        </Modal>
      )}

      {isHelloWorldModalOpen && (
        <Modal
          isOpen={isHelloWorldModalOpen}
          onClose={handleCloseHelloWorldModal}
        >
          <div className={styles.modalContainer}>
            <h2>Withdrawal Consent</h2>
            <p>We will send a withdrawal request consent to other members of the Olowo family before sending the fund to you. You can inform the other family members to fast-track the process.</p>
            <button>{'Continue'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FamilyVault;