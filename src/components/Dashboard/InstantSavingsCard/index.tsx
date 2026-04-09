"use client";
import styles from "./card.module.css";
import Upright from "@/assets/up-right.svg";

type Props = {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  secondDescription: string;
  backgroundColor: string;
  onClick: () => void;
};

const InstantSavingsCard: React.FC<Props> = ({
  icon,
  backgroundColor,
  title,
  subTitle,
  secondDescription,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        style={{ backgroundColor: backgroundColor }}
        className={styles.iconContainer}
      >
        {icon}
      </div>

      <div className={styles.textContainer}>
        <p className={styles.title}>{title}</p>
        <div className={styles.bottomContainer}>
          <p>{subTitle}</p>
          <p>&bull;</p>
          <p>{secondDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default InstantSavingsCard;
