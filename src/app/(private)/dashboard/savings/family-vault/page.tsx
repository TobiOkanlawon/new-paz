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

interface Family {
  title: string;
  description: string;
  targetAmount: number;
  amount: number;
  accountNo: string;
  owner?: boolean;
  members?: number;
  url?: string;
}


const FamilyVault = () => {
  const { user } = useUser();

  // ✅ All hooks must be at the top
  const [showMoney, setShowMoney] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string
  );

  const handleToggle = () => setShowMoney((prev) => !prev);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );

const families: Family[] = data!.familyVault.map((plan: TTargetSavingsPlan) => ({
  title: plan.Title ?? "",
  description: plan.description ?? "",
  targetAmount: plan.targetAmount ?? 0,
  amount: plan.amount ?? 0,
  accountNo: plan.accountNo ?? "",
  owner: true,
  members: 1,
  url: "",
}));


  const calculateTotal = (allPlans: Family[]) =>
    allPlans.reduce((p, c) => p + c.amount, 0);

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
