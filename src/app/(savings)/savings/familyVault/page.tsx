"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import NotificationContainer from "@/components/NotificationContainer";
import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import WithdrawModal from "@/components/WithdrawModal";
import TotalFamilyCard from "@/components/TotalFamilyCard";

const FamilyVault = () => {
  const router = useRouter();
  interface Notification {
    id: string;
    message: string;
    time: string;
    amount?: string;
  }

  const notifications: Notification[] = [
    // {id: '1', message: 'PAZ saver account created', time: '2 hours ago'},
    // {id: '2', message: 'PAZ saver account created', time: '2 hours ago'},
    // {id: '3', message: 'PAZ saver account created', time: '2 hours ago'},
  ];

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
      <div
        onClick={() => {
          router.back();
        }}
        className={styles.backContainer}
      >
        <Image
          src={"/ArrowLeft.png"}
          className={styles.arrowBack}
          width={24}
          height={24}
          alt="Arrow Back"
        />
        <p>Back</p>
      </div>
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

      <div className={styles.activities}>
        <h5>Recent activitiy</h5>
        {notifications.length !== 0 ? (
          notifications.map((notification) => (
            <NotificationContainer
              key={notification.id}
              message={notification.message}
              time={notification.time}
              amount={notification.amount ? notification.amount : ""}
            />
          ))
        ) : (
          <div className={styles.emptyContainer}>
            <Image
              src={"/noNotification.png"}
              alt="No notification image"
              width={193}
              height={193}
            />
            <p>You have no recent actiities yet!</p>
          </div>
        )}
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