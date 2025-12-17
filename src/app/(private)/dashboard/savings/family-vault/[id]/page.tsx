"use client";
import React, { useState } from "react";
import styles from "./familyVault.module.css";
import TotalBalanceCard from "@/components/TotalBalanceCard";
import Back from "@/components/BackContainer";
import FamilyVaultCards from "@/components/FamilyCard";
import Button from "@/components/Button";
import FamilyVaultModal from "@/components/Savings/FamilyVaultModal";
import useUser from "@/store/userStore";
import { useGetAccountDetails } from "@/data/queries/useGetAccountDetails";
import { Loading } from "@/components/Loading";
import { ErrorComponent } from "@/components/Error";
import RecentActivity from "@/components/Shared/RecentActivity";

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

  // ✅ ALL HOOKS FIRST
  const { data, isLoading, error } = useGetAccountDetails(
    user?.email as string
  );

  const [showMoney, setShowMoney] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToggle = () => setShowMoney((prev) => !prev);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  // ✅ Only now — handle conditional returns
  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorComponent message="An error occurred" retryFunction={() => {}} />
    );

  // ✅ Convert backend → frontend type
  const families: Family[] = data!.targetSavings.map(
    (plan: TTargetSavingsPlan) => ({
      title: plan.Title ?? "",
      description: plan.description ?? "",
      targetAmount: plan.targetAmount ?? 0,
      amount: plan.amount ?? 0,
      accountNo: plan.accountNo ?? "",
      owner: true,
      members:  1,
      url: "",
    })
  );

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
          <Button onClick={showModal} className="px-8 font-normal text-[.8rem]">
            Create a Family Vault Plan
          </Button>
        </div>
      </div>

      <div className={styles.cardContainers}>
        <TotalBalanceCard
          header="Total savings balance"
          money={calculateTotal(families)}
        />

        <FamilyVaultModal
          isActive={isModalVisible}
          handleCloseModal={closeModal}
        />
      </div>

      <div className={styles.notificationContainer}>
        <RecentActivity />
      </div>
    </div>
  );
};

export default FamilyVault;
