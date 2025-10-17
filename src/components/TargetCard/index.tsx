"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./targetcard.module.css";
import ProgressBar from "@/components/ProgressBar2";

type TargetCardProps = Omit<TTargetSavingsPlan, "Title" | "accountNo"> & {
  title: string;
  id: string;
};

const TargetCard: React.FC<TargetCardProps> = ({
  title,
  description,
  amount,
  targetAmount,
  id,
}) => {
  const router = useRouter();

  const percentage = (amount / targetAmount) * 100;

  const capitalise = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleRouteToPlan = () => {
    router.push(`/savings/target-savings/${id}`);
  };

  return (
    <div className={styles.cardConainer} onClick={handleRouteToPlan}>
      <h2>{capitalise(title)}</h2>
      <p>{description}</p>
      <h3>₦ {Intl.NumberFormat("en-US").format(amount)} </h3>
      <div className={styles.cardBottom}>
        <ProgressBar percentage={percentage} />
      </div>
    </div>
  );
};

export default TargetCard;
