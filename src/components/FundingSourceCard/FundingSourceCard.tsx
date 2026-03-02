import React from "react";
import styles from "./fundingSourceCard.module.css";
import { IoCheckmark } from "react-icons/io5";
import { FiCreditCard } from "react-icons/fi";

type Props = {
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const FundingSourceCard = ({
  title,
  subtitle,
  selected = false,
  onClick,
  icon,
}: Props) => {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.left}>
        <div className={styles.iconWrap}>{icon ?? <FiCreditCard />}</div>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.sub}>{subtitle}</p>
        </div>
      </div>

      {selected && (
        <span className={styles.checkWrap} aria-label="selected">
          <IoCheckmark />
        </span>
      )}
    </button>
  );
};

export default FundingSourceCard;