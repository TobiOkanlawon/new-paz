import React from "react";
import styles from "../kycverification.module.css";

const TOTAL_STEPS = 3;

const StepIndicator = ({ current }: { current: number }) => (
  <div className={styles.stepIndicator}>
    {[1, 2, 3].map((step) => (
      <React.Fragment key={step}>
        <div
          className={`${styles.stepDot} ${
            current >= step ? styles.stepDotActive : ""
          } ${current === step ? styles.stepDotCurrent : ""}`}
        >
          <span
            className={`${styles.stepDot} ${
              current >= step ? styles.stepDotActive : ""
            } ${current === step ? styles.stepDotCurrent : ""}`}
          >
            {step}
          </span>
        </div>
        {step < TOTAL_STEPS && (
          <div
            className={`${styles.stepLine} ${
              current > step ? styles.stepLineActive : ""
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepIndicator;
