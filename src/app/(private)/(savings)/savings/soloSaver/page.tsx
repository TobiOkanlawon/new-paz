"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./soloSaver.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import NotificationContainer from "@/components/NotificationContainer";
import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import WithdrawModal from "@/components/WithdrawModal";
import Back from "@/components/BackContainer";
import Notifications from "@/components/Notifications";

const SoloSaver = () => {
  interface Notification {
    id: number;
    message: string;
    time: string;
    amount?: string;
  }

  const notifications: Notification[] = [];

  const handleCloseModal = () => {
    setIsActive(false);
  };
  const handleOpenModal = () => {
    setIsActive(true);
  };

  const [isActive, setIsActive] = useState(false);
  return (
    <div className={styles.container}>
      <Back />
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.header}>PAZ Solo Saver</h2>
          <p className={styles.headingText}>
            Save money spontenously with interest of up to 12% per annum.
          </p>
        </div>
        <div>
          <button onClick={handleOpenModal} className={styles.widFunds}>
            Withdraw Funds
          </button>
        </div>
      </div>

      <div>
        <TotalBalanceCard
          money={0}
          header="PAZ saver balance"
          buttonText="Instant top-up "
          modalContent={<TopUpModal />}
        />
      </div>

      <div className={styles.activities}>
        <Notifications
          header="Recent activities"
          notifications={notifications}
        />
      </div>
      {isActive && (
        <Modal isOpen={isActive} onClose={handleCloseModal}>
          {<WithdrawModal />}
        </Modal>
      )}
    </div>
  );
};

export default SoloSaver;
