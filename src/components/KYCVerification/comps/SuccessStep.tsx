import React from "react";
import styles from "../kycverification.module.css";

const SuccessStep = ({ onBack }: { onBack: () => void }) => (
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

    <h1 className={styles.successTitle}>BVN Verification</h1>
    <p className={styles.successMessage}>Your BVN verification was successful</p>

    <button
      className={`${styles.primaryBtn} ${styles.successBtn}`}
      onClick={onBack}
    >
      Back
    </button>
  </div>
);

export default SuccessStep;
