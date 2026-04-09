"use client";
import { useRouter } from "next/navigation";
import styles from "../addaccountverification.module.css";

type SuccessStepProps = {
  title: string;
  text: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

const SuccessStep = ({
  title,
  text,
  buttonText,
  onButtonClick,
}: SuccessStepProps) => {
  const navigate = useRouter();
  
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate.replace("/dashboard");
    }
  };

  return (
    <div className={styles.successContent}>
      <div className={styles.successIconWrap}>
        <div className={styles.successRipple} />
        <div className={styles.successCircle}>
          <svg viewBox="0 0 40 40" fill="none">
            <path
              d="M10 20l7 7 13-14"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.checkPath}
            />
          </svg>
        </div>
      </div>

      <h1 className={styles.successTitle}>{title}</h1>
      <p className={styles.successMessage}>{text}</p>

      <button
        className={`${styles.primaryBtn} ${styles.successBtn}`}
        onClick={handleClick}
      >
        {buttonText ?? "Back"}
      </button>
    </div>
  );
};

export default SuccessStep;