'use client'
import React, { useState } from "react";
import styles from "./ProjectCard.module.css";
import { LuEye, LuEyeOff, LuEllipsisVertical } from "react-icons/lu";

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  amount: string;
  prefix?: string;
  onMenuClick?: VoidFunction;
};

const ProjectCard = ({
  icon,
  iconBg,
  title,
  amount,
  prefix,
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

      <div className={styles.amountRow}>
        <span className={styles.amount}>
          {concealed
            ? `${prefix ? prefix + " " : ""}••••••`
            : `${prefix ? prefix + " " : ""}${amount}`}
        </span>
        <button className={styles.eyeBtn} onClick={() => setConcealed((p) => !p)}>
          {concealed
            ? <LuEyeOff size={18} color="#878787" />
            : <LuEye size={18} color="#878787" />}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;