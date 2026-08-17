import clsx from "clsx";
import styles from "./quickaction.module.css";

type QuickActionProps = {
  backgroundColor: string;
  action: () => void;
  text: string;
  icon: React.ReactNode;
  color?: string;
  disabled?: boolean;
};

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  text,
  backgroundColor,
  action,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : action}
      className={clsx(styles.quickActionCardContainer, {
        [styles.disabled]: disabled,
      })}
      aria-disabled={disabled}
    >
      <div className={styles.quickActionCardInnerContainer}>
        <div
          className={styles.quickActionCardIconContainer}
          style={{ backgroundColor: backgroundColor }}
        >
          {icon}
        </div>
        <p className={styles.quickActionText}>
          {text}
          {disabled && <span className={styles.comingSoon}> (Coming Soon)</span>}
        </p>
      </div>
    </div>
  );
};

export default QuickActionCard;
