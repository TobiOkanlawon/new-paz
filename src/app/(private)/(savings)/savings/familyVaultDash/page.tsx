"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import Back from "@/components/BackContainer";
import FamilyCard from "@/components/FamilyCard";
import Button from "@/components/Button";
import FamilyVaultModal from "@/components/Savings/FamilyVaultModal";

const FamilyVault = () => {
  const families = [
    {
      name: "Olowo Family",
      desc: "Monthly food saving quota",
      money: "500000",
      members: 3,
      owner: true,
    },
    {
      name: "Lekki House Family",
      desc: "Rent saving quota",
      money: "1500000",
      members: 3,
    },
    {
      name: "Olowo Family",
      desc: "Monthly food saving quota",
      money: "500000",
      members: 3,
      owner: true,
    },
    {
      name: "Lekki House Family",
      desc: "Rent saving quota",
      money: "1500000",
      members: 3,
    },
    {
      name: "Olowo Family",
      desc: "Monthly food saving quota",
      money: "500000",
      members: 3,
      owner: true,
    },
    {
      name: "Lekki House Family",
      desc: "Rent saving quota",
      money: "1500000",
      members: 3,
    },
  ];
  const [showMoney, setShowMoney] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleToggle = () => setShowMoney((prev) => !prev);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

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

      <TotalBalanceCard header="Total savings balance" money={2000000} />

      <FamilyCard Families={families} />
      <FamilyVaultModal
        isActive={isModalVisible}
        handleCloseModal={closeModal}
      />
    </div>
  );
};

export default FamilyVault;
