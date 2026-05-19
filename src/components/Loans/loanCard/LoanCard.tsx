'use client'
import React, { useState } from "react";
import styles from "./LoanCard.module.css";
import { LuEye, LuEyeOff, LuEllipsisVertical } from "react-icons/lu"; // ✅ /lu for Lucide

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  amount: string;
  bottomRight?: string;
  bottomRightColor?: string;
  onMenuClick?: VoidFunction;
};

const LoanCard = ({
  icon,
  iconBg,
  title,
  amount,
  bottomRight,
  bottomRightColor = "#17A842",
  onMenuClick,
}: Props) => {
  const [concealed, setConcealed] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.iconWrapper} style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <LuEllipsisVertical size={18} color="#878787" />
        </button>
      </div>

      <p className={styles.title}>{title}</p>

      <div className={styles.bottomRow}>
        <div className={styles.amountRow}>
          <span className={styles.amount}>
            {concealed ? "NGN ••••••" : amount}
          </span>
          <button
            className={styles.eyeBtn}
            onClick={() => setConcealed((prev) => !prev)}
          >
            {concealed ? (
              <LuEyeOff size={18} color="#878787" />
            ) : (
              <LuEye size={18} color="#878787" />
            )}
          </button>
        </div>

        {bottomRight && (
          <span className={styles.bottomRight} style={{ color: bottomRightColor }}>
            {bottomRight}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoanCard;