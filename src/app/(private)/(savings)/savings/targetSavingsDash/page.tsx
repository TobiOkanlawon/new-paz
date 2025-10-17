"use client";
import React, { useState } from "react";
import styles from "./targetSavings.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import TargetCard from "@/components/TargetCard";
import Back from "@/components/BackContainer";
import Button from "@/components/Button";
import TargetSavingsModal from "@/components/Savings/TargetSavingsModal";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import useUser from "@/store/userStore";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";

const FamilyVault = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );

  const targetCards: TTargetSavingsPlan[] = [
    {
      id: "1",
      name: "Project New Car",
      description: "I must buy Camaro",
      amount: 500000,
      target: 500000,
    },
    {
      id: "2",
      name: "House Rent Runs",
      description: "Rent saving quota",
      amount: 1500000,
      target: 1500000,
    },
    {
      id: "3",
      name: "Project New Car",
      description: "I must buy Camaro",
      amount: 500000,
      target: 500000,
    },
    {
      id: "4",
      name: "House Rent Runs",
      description: "Rent saving quota",
      amount: 1500000,
      target: 1500000,
    },
    {
      id: "5",
      name: "Project New Car",
      description: "I must buy Camaro",
      amount: 500000,
      target: 500000,
    },
    {
      id: "6",
      name: "House Rent Runs",
      description: "Rent saving quota",
      amount: 1500000,
      target: 1500000,
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const calculateTotal = (allPlans: TTargetSavingsPlan[]) => {
    return allPlans.reduce((p, c) => p + c.amount, 0);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );
  }

  return (
    <div className={styles.container}>
      <Back />
      <div className={styles.topContainer}>
        <div className={styles.topContainerLeft}>
          <h2 className={styles.header}>PAZ Family Vault</h2>
          <p className={styles.headingText}>
            Explore all our savings plans here.
          </p>
        </div>
        <div className={styles.topContainerRight}>
          <Button onClick={showModal} className="px-8">
            Create a Target Savings Plan
          </Button>
        </div>
      </div>

      <TotalBalanceCard
        header="Total savings balance"
        money={calculateTotal(targetCards)}
      />

      <div className={styles.cardContainer}>
        {targetCards.map(({ id, name, description, target, amount }) => {
          return (
            <TargetCard
              key={id}
              id={id}
              name={name}
              description={description}
              target={target}
              amount={amount}
            />
          );
        })}
      </div>

      <TargetSavingsModal
        isActive={isModalVisible}
        handleCloseModal={closeModal}
      />
    </div>
  );
};

export default FamilyVault;
