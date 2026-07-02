import styles from "./quickaction.module.css";

type QuickActionProps = {
  backgroundColor: string;
  action: () => void;
  text: string;
  icon: React.ReactNode;
  color?: string;
};

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  text,
  backgroundColor,
  action,
}) => {
  return (
    <div onClick={action} className={styles.quickActionCardContainer}>
      <div className={styles.quickActionCardInnerContainer}>
        <div
          className={styles.quickActionCardIconContainer}
          style={{ backgroundColor: backgroundColor }}
        >
          {icon}
        </div>
        <p className={styles.quickActionText}>{text}</p>
      </div>
    </div>
  );
};

export default QuickActionCard;
