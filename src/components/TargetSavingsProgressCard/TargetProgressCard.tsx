import styles from "./targetProgressCard.module.css";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";

type Props = {
  name: string;
  accountId: string;

  currentAmount: number;
  targetAmount: number;

  currency?: string; // default ₦
  onClick?: () => void;
  className?: string;

  /** Optional: override computed percentage (0-100) */
  percentOverride?: number;

  /** Optional: show arrow icon */
  showArrow?: boolean;
};

const formatMoney = (value: number, currency: string) => {
  const formatted = value.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  });
  return `${currency}${formatted}`;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const TargetProgressCard = ({
  name,
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
    100
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
        <p className={styles.amountRight}>
          of {formatMoney(targetAmount, currency)}
        </p>
      </div>

      <div className={styles.progressTrack} aria-label="progress">
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%` }}
        />
      </div>

        <div className={styles.percentTextContainer}>
            <p className={styles.percentText}>
                31/12/2026
            </p>
            <p className={styles.percentText}>
                <Image src="/images/lock.png" alt="lock icon" width={24} height={24} /> 
            </p>
        </div>
    </button>
  );
};

export default TargetProgressCard;