import React from "react";
import styles from "../addaccountverification.module.css";

const OverviewStep = ({ onContinue }: { onContinue: () => void }) => (
  <div className={styles.stepContent}>
    <div className={styles.header}>
      <h1 className={styles.title}>Primary Account Verification</h1>
      <p className={styles.subtitle}>
        Add primary account information to enable seamless transactions and withdrawals
      </p>
    </div>

    <div className={styles.verificationCard}>
      <div className={styles.cardIcon}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3"
            y="6"
            width="18"
            height="13"
            rx="2"
            stroke="#4361EE"
            strokeWidth="1.8"
          />
          <path
            d="M3 10h18"
            stroke="#4361EE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 14h3M7 17h5"
            stroke="#4361EE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>Primary Account</span>
        <span className={styles.cardDesc}>
          Add your primary bank account information
        </span>
      </div>
      <svg
        className={styles.cardArrow}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18l6-6-6-6"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <button className={styles.primaryBtn} onClick={onContinue}>
      Continue
    </button>
  </div>
);

export default OverviewStep;
