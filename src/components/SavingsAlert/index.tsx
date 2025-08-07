import React, { useEffect, useState } from "react";
import styles from "./savingsAlert.module.css";
import Image from "next/image";

interface SavingsAlertProps {
  isActive: boolean;
  isSuccessful: boolean;
  onClose: () => void;
  message: string;
}

const SavingsAlert: React.FC<SavingsAlertProps> = ({
  isActive,
  isSuccessful,
  onClose,
  message,
}) => {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      setFadingOut(false);
    } else if (visible) {
      setFadingOut(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setFadingOut(false);
      }, 500); // Match fade-out animation duration
      return () => clearTimeout(timeout);
    }
  }, [isActive, visible]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.alertContainer} ${fadingOut ? styles.fadeOut : styles.fadeIn}`}
    >
      {isSuccessful ? (
        <p className={styles.success}>
          {message}
          <Image
            src="/profileAlertClose.png"
            alt="Profile Alert Close"
            width={12}
            height={12}
            onClick={onClose}
            style={{ cursor: "pointer", marginLeft: "0.5rem" }}
          />
        </p>
      ) : (
        <p className={styles.noSuccess}>
          Error Executing Command
          <Image
            src="/profileAlertClose.png"
            alt="Profile Alert Close"
            width={12}
            height={12}
            onClick={onClose}
            style={{ cursor: "pointer", marginLeft: "0.5rem" }}
          />
        </p>
      )}
    </div>
  );
};

export default SavingsAlert;
