import React from "react";
import styles from "../kycverification.module.css";

const InfoStep = ({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) => (
  <div className={styles.stepContent}>
    <div className={styles.header}>
      <h1 className={styles.title}>Add Your BVN</h1>
      <p className={styles.subtitle}>
        Your Bank Verification Number is required to verify your identity and
        comply with banking regulations.
      </p>
    </div>

    <ul className={styles.featureList}>
      {[
        "Your BVN is kept secure and encrypted",
        "Required for account verification",
        "Complies with banking regulations",
      ].map((item, i) => (
        <li key={i} className={styles.featureItem}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8l3.5 3.5 6.5-7"
                stroke="#4361EE"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>

    <button className={styles.primaryBtn} onClick={onContinue}>
      Continue
    </button>
  </div>
);

export default InfoStep;
