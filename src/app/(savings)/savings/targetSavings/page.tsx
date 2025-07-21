"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./targetSavings.module.css";
import { useRouter } from "next/navigation";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import NotificationContainer from "@/components/NotificationContainer";
import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import WithdrawModal from "@/components/WithdrawModal";
import ToggleSwitch from '@/components/ToggleSwitch';
import WithdrawalOptions from "@/components/WithdrawalOptions";



const TargetSavings = () => {
  const router = useRouter();
  interface Notification {
    id: string;
    message: string;
    time: string;
    amount?: string;
  }

  const notifications: Notification[] = [];

  const handleCloseModal = () => {
    setIsActive(false);
  }
  const handleOpenModal = () => {
    setIsActive(true);
  }
  const handleCloseModal1 = () => {
    setIsActive2(false);
  }
  const handleOpenModal1 = () => {
    setIsActive2(true);
  }

  let [isActive, setIsActive]  = useState(false)
  let [isActive2, setIsActive2]  = useState(false)
  const [fundsLocked, setFundsLocked] = useState(false);
  
  const [isPending, setIsPending] = useState(false);
  const handlePending = () => setIsPending(true)

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
          <h2 className={styles.header}>Project New Car</h2>
          <p className={styles.headingText}>
            I must buy Camaro
          </p>
        </div>
        <div className={styles.actionsContainer}>
          <p style={{color: '#7131DA', fontWeight: '500'}}><Image style={{marginTop: '.1rem'}} src={'/share.svg'} alt="share icon" width={13.5} height={14.94}/> Share payement link</p>
          <button onClick={handleOpenModal} className={styles.widFunds}>Withdraw Funds</button>
          <ToggleSwitch
            checked={fundsLocked}
            onChange={setFundsLocked}
            label="Lock funds"
          />
        </div>
      </div>

      <div style={{display: 'flex', gap: '2rem'}}>
        <TotalBalanceCard
          header="PAZ saver balance"
          buttonText="Instant top-up "
          isPending={isPending}
          money={50000}
          onCancelPending={() => setIsPending(false)}
          modalContent={
            <TopUpModal />
          }
        />
        <TotalBalanceCard
        header="Your Target"
        money={50000000}
        />
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
       {isActive && (
        <Modal isOpen={isActive} onClose={handleCloseModal}>
          {(
            // <WithdrawModal />
            <WithdrawalOptions handlePending={handlePending} onClose={handleCloseModal}/>
          )}
        </Modal>
      )}
       {/* {isActive2 && (
        <Modal isOpen={isActive2} onClose={handleCloseModal1}>
          {(
            <WithdrawModal />
            // <WithdrawalOptions/>
          )}
        </Modal>
      )} */}
    </div>
  );
};

export default TargetSavings;
