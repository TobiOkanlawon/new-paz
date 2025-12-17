"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./targetSavings.module.css";
import { notFound, useParams, useRouter } from "next/navigation";
import TotalBalanceCard from "@/components/TotalBalanceCard";

import TopUpModal from "@/components/TopupModal";
import Modal from "@/components/Modal";
import WithdrawModal from "@/components/WithdrawModal";
import ToggleSwitch from "@/components/ToggleSwitch";
import WithdrawalOptions from "@/components/WithdrawalOptions";
import Notifications from "@/components/Notifications";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";

const TargetSavings = () => {
  const router = useRouter();

  const handleCloseModal = () => {
    setIsActive(false);
  };
  const handleOpenModal = () => {
    setIsActive(true);
  };
  const handleCloseModal1 = () => {
    setIsActive2(false);
  };
  const handleOpenModal1 = () => {
    setIsActive2(true);
  };

  const { id } = useParams<{ id: string }>();

  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );

  const planData: TTargetSavingsPlan | undefined = data?.targetSavings.find(
    (t: TTargetSavingsPlan) => {
      return t.accountNo == id;
    },
  );

  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [fundsLocked, setFundsLocked] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const handlePending = () => setIsPending(true);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent message="An error occured" retryFunction={() => {}} />
    );
  }

  if (planData === undefined) return notFound();

  return (
    <div className={styles.container}>
      <div onClick={router.back} className={styles.backContainer}>
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
          <h2 className={styles.header}>{planData.Title}</h2>
          <p className={styles.headingText}>{planData.description}</p>
        </div>
        <div className={styles.actionsContainer}>
          <p style={{ color: "#7131DA", fontWeight: "500", display: "none" }}>
            <Image
              style={{ marginTop: ".1rem" }}
              src={"/share.svg"}
              alt="share icon"
              width={13.5}
              height={14.94}
            />{" "}
            Share payment link
          </p>
          <button onClick={handleOpenModal} className={styles.widFunds}>
            Withdraw Funds
          </button>
          <ToggleSwitch
            checked={fundsLocked}
            onChange={setFundsLocked}
            label="Lock funds"
          />
        </div>
      </div>

      <div className={styles.totalContainer}>
        <TotalBalanceCard
          header="PAZ saver balance"
          buttonText="Instant top-up"
          isPending={isPending}
          money={planData.amount}
          onCancelPending={() => setIsPending(false)}
          modalContent={<TopUpModal />}
        />
        <TotalBalanceCard header="Your Target" money={planData.targetAmount} />
      </div>

      <div className={styles.activities}>
        <Notifications header={"Recent activity"} />
      </div>
      {isActive && (
        <Modal isOpen={isActive} onClose={handleCloseModal}>
          {
            // <WithdrawModal />
            <WithdrawalOptions
              handlePending={handlePending}
              onClose={handleCloseModal}
            />
          }
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
