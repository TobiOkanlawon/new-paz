"use client";
import Image, { ImageProps } from "next/image";
import styles from "./card.module.css";
import Upright from "@/assets/up-right.svg";

type Props = {
  icon: ImageProps["src"];
  title: string;
  subTitle: string;
  secondDescription: string;
  backgroundColor: string;
};

const InstantSavingsCard: React.FC<Props> = ({
  icon,
  backgroundColor,
  title,
  subTitle,
  secondDescription,
}) => {
  return (
    <div className={styles.card}>
      <div
        style={{ backgroundColor: backgroundColor }}
        className={styles.iconContainer}
      >
        <Image height={28} width={28} src={Upright} alt="" />
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
