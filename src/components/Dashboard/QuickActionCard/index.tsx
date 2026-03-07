import Image, { ImageProps } from "next/image";
import styles from "./quickaction.module.css";

type QuickActionProps = {
  backgroundColor: string;
  action: () => void;
  text: string;
  icon: ImageProps["src"];
  color?: string;
};

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  text,
  backgroundColor,
}) => {
  return (
    <div className={styles.quickActionCardContainer}>
      <div className={styles.quickActionCardInnerContainer}>
        <div
          className={styles.quickActionCardIconContainer}
          style={{ backgroundColor: backgroundColor }}
        >
          <Image src={icon} alt="icon" />
        </div>
        <p className={styles.quickActionText}>{text}</p>
      </div>
    </div>
  );
};

export default QuickActionCard;
