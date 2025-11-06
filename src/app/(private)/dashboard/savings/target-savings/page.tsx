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
import { addSavings } from "@/libs/helpers";

const FamilyVault = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );
  }

  // this function is after the isLoading block because allPlans is null if the data hasn't loaded
  const calculateTotal = (allPlans: TTargetSavingsPlan[]) => {
    return allPlans.reduce((p, c) => p + c.amount, 0);
  };

  // Backend sometimes returns `title` instead of `Title`. Normalize to the expected shape.
  type RawTargetPlan = Partial<TTargetSavingsPlan> & {
    title?: string;
    Title?: string;
  };

  const targetCards: TTargetSavingsPlan[] = (
    data!.targetSavings as RawTargetPlan[]
  ).map((card) => ({
    Title: card.Title ?? card.title ?? "",
    description: card.description ?? "",
    amount: card.amount ?? 0,
    targetAmount: card.targetAmount ?? 0,
    accountNo: card.accountNo ?? "",
  }));

  return (
    <div className={styles.container}>
      <Back />
      <div className={styles.topContainer}>
        <div className={styles.topContainerLeft}>
          <h2 className={styles.header}>PAZ Target Savings</h2>
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
        money={addSavings(data!).targetSavings}
      />

      <div className={styles.cardContainer}>
        {targetCards.map(
          ({ Title: title, description, targetAmount, amount, accountNo }) => {
            return (
              <TargetCard
                key={accountNo}
                id={accountNo}
                title={title}
                description={description}
                targetAmount={targetAmount}
                amount={amount}
              />
            );
          },
        )}
      </div>

      <TargetSavingsModal
        isActive={isModalVisible}
        handleCloseModal={closeModal}
      />
    </div>
  );
};

export default FamilyVault;
