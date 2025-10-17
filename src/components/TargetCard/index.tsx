"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./targetcard.module.css";
import ProgressBar from "@/components/ProgressBar2";

const TargetCard: React.FC<TTargetSavingsPlan> = ({
  Title,
  description,
  amount,
  targetAmount,
}) => {
  const router = useRouter();

  const handleCardClick = (url: string) => {
    router.push(url);
  };

  const percentage = (amount / targetAmount) * 100;

  const capitalise = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div
      className={styles.cardConainer}
      // onClick={() => handleCardClick(family.url)}
    >
      <h2>{capitalise(Title)}</h2>
      <p>{description}</p>
      <h3>₦ {Intl.NumberFormat("en-US").format(amount)} </h3>
      <div className={styles.cardBottom}>
        <ProgressBar percentage={percentage} />
      </div>
    </div>
  );
};

export default TargetCard;
