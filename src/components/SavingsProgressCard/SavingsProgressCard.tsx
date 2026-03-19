import React from "react";
import styles from "./savingsProgressCard.module.css";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  name: string;
  accountId: string;

  currentAmount: number;
  targetAmount: number;

  currency?: string; // default ₦
  onClick?: () => void;
  className?: string;
  isTarget?: boolean;

  /** Optional: override computed percentage (0-100) */
  percentOverride?: number;

  /** Optional: show arrow icon */
  showArrow?: boolean;
};

const formatMoney = (value: string, currency: string) => {
  const formatted = Number(value).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  });
  return `${currency}${formatted}`;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const SavingsProgressCard = ({
  name,
  isTarget = true,
  accountId,
  currentAmount,
  targetAmount,
  currency = "₦",
  onClick,
  className,
  percentOverride,
  showArrow = true,
}: Props) => {
  const computedPercent =
    targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  const percent = clamp(
    typeof percentOverride === "number" ? percentOverride : computedPercent,
    0,
    100,
  );

  return (
    <button
      type="button"
      className={`${styles.card} ${className ?? ""}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <div className={styles.topRow}>
        <div>
          <p className={styles.name}>{name}</p>
          <p className={styles.sub}>{accountId}</p>
        </div>

        {showArrow && (
          <span className={styles.arrow} aria-hidden="true">
            <FiArrowUpRight />
          </span>
        )}
      </div>

      <div className={styles.amountRow}>
        <p className={styles.amountLeft}>
          {formatMoney(currentAmount, currency)}
        </p>
        {isTarget && (
          <p className={styles.amountRight}>
            of {formatMoney(targetAmount, currency)}
          </p>
        )}
      </div>

      {isTarget && (
        <>
          <div className={styles.progressTrack} aria-label="progress">
            <div
              className={styles.progressFill}
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className={styles.percentText}>{percent.toFixed(1)}% of target</p>
        </>
      )}
    </button>
  );
};

export default SavingsProgressCard;
