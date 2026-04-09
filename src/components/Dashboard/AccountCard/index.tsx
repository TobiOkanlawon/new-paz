"use client";
import styles from "./styles.module.css";
import ThreeDots from "@/assets/three-dots.svg";
import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Image from "next/image";

type AccountCardProps = {
  icon: React.ReactNode;
  backgroundColor: string;
  iconColor: string;
  title: string;
  amount: number;
  rateBackgroundColor?: string;
  rateTextColor?: string;
};

const AccountCard: React.FC<AccountCardProps> = ({
  icon,
  title,
  backgroundColor,
  iconColor: color,
  amount = 0,
  rateBackgroundColor = "#E8F8EE",
  rateTextColor = "#12B76A",
}) => {
  const [showAmount, setShowAmount] = useState(true);

  const formattedAmount = (amount: number) => {
    /* takes a number in naira and formats it to have two decimal points */

    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.topContainer}>
        <div
          style={{ backgroundColor: backgroundColor }}
          className={styles.iconContainer}
        >
          {icon}
        </div>

        <Image src={ThreeDots} alt="menu" width={16} height={16} />
      </div>

      <p className={styles.titleText}>{title}</p>

      <div className={styles.bottomContainer}>
        <div className={styles.amountWrap}>
          <span className={styles.amountText}>
            {showAmount ? `NGN ${formattedAmount(amount)}` : "NGN ••••••"}
          </span>
          <button
            type="button"
            className={styles.toggleAmountBtn}
            onClick={() => setShowAmount((prev) => !prev)}
            aria-label={showAmount ? "Hide amount" : "Show amount"}
          >
            {showAmount ? <LuEye size={24} /> : <LuEyeOff size={24} />}
          </button>
        </div>
        {/*
        <span
          className={styles.ratePill}
          style={{ backgroundColor: rateBackgroundColor, color: rateTextColor }}
        >
        {//rate > 0 ? `+${rate}%` : `${rate}%`}
        </span>
          */}
      </div>
    </div>
  );
};

export default AccountCard;
