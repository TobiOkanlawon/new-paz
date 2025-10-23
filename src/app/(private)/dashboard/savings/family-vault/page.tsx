"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import Back from "@/components/BackContainer";
import FamilyCard from "@/components/FamilyCard";
import Button from "@/components/Button";
import FamilyVaultModal from "@/components/Savings/FamilyVaultModal";
import useUser from "@/store/userStore";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";

const FamilyVault = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string,
  );
  // const families = [
  //   {
  //     name: "Olowo Family",
  //     desc: "Monthly food saving quota",
  //     money: "500000",
  //     members: 3,
  //     owner: true,
  //   },
  //   {
  //     name: "Lekki House Family",
  //     desc: "Rent saving quota",
  //     money: "1500000",
  //     members: 3,
  //   },
  //   {
  //     name: "Olowo Family",
  //     desc: "Monthly food saving quota",
  //     money: "500000",
  //     members: 3,
  //     owner: true,
  //   },
  //   {
  //     name: "Lekki House Family",
  //     desc: "Rent saving quota",
  //     money: "1500000",
  //     members: 3,
  //   },
  //   {
  //     name: "Olowo Family",
  //     desc: "Monthly food saving quota",
  //     money: "500000",
  //     members: 3,
  //     owner: true,
  //   },
  //   {
  //     name: "Lekki House Family",
  //     desc: "Rent saving quota",
  //     money: "1500000",
  //     members: 3,
  //   },
  // ];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );
  }

  // Title: "test";
  // accountNo: "9728906907";
  // amount: 0;
  // description: "The author addresses such theological questions as What is God like? Why pray? Male and female-how are we related? How do people see Jesus? What is the shape of the godly life? If the Lord is with us, why do we suffer? How do we face death? through short meditations, each staring with a Bible verse and ending with a brief prayer.";
  // targetAmount: 100000;
  // title: "test";

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
  console.log(families);
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

      <TotalBalanceCard
        header="Total savings balance"
        money={calculateTotal(families)}
      />

      <FamilyCard Families={families} />
      <FamilyVaultModal
        isActive={isModalVisible}
        handleCloseModal={closeModal}
      />
    </div>
  );
};

export default FamilyVault;
