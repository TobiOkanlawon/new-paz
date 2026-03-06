"use client";
import Image, { ImageProps } from "next/image";
import styles from "./savingscard.module.css";
import Upright from "@/assets/up-right.svg";

type MiniCardProps = {
  title: string;
  image: ImageProps["src"];
  content: string;
  action?: () => void;
  borderColor: string;
  imageBackgroundColor: string;
  showTopRightIcon?: boolean;
};

const SavingsPlanMiniCard: React.FC<MiniCardProps> = ({
  title,
  image,
  content,
  action,
  borderColor,
  imageBackgroundColor,
  showTopRightIcon = true,
}) => {
  return (
    <div
      style={{ borderColor: borderColor }}
      className={styles.miniCardContainer}
    >
      <div className={styles.miniCardTitleContainer}>
        <div className={styles.miniCardImageContainerLeft}>
          <div
            className={styles.miniCardImageContainer}
            style={{ backgroundColor: imageBackgroundColor }}
          >
            <Image src={image} alt="" height={16} width={16} />
          </div>
          <h3 className={styles.miniCardTitle}>{title}</h3>
        </div>
        {showTopRightIcon && (
          <div className={styles.upRightContainer}>
            <Image src={Upright} alt="" height={16} width={16} />
          </div>
        )}
      </div>

      <div className={styles.miniCardContentContainer}>
        <p>{content}</p>
      </div>

      <div className={styles.miniCardBottomContainer}>
        <button onClick={action} className={styles.miniCardActionButton}>
          Setup
        </button>
      </div>
    </div>
  );
};

export default SavingsPlanMiniCard;
