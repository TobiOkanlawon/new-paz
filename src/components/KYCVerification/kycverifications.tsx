"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./kycverification.module.css";

type Step = "overview" | "info" | "enter" | "success";

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
          <span>{step}</span>
          {current > step && (
            <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
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

const OverviewStep = ({ onContinue }: { onContinue: () => void }) => (
  <div className={styles.stepContent}>
    <div className={styles.header}>
      <h1 className={styles.title}>KYC Verification</h1>
      <p className={styles.subtitle}>
        Complete your verification with the following steps
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
        <span className={styles.cardTitle}>BVN Verification</span>
        <span className={styles.cardDesc}>
          Input your Bank Verification Number to verify your identity
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

const EnterStep = ({
  onVerify,
  onBack,
}: {
  onVerify: () => void;
  onBack: () => void;
}) => {
  const [bvn, setBvn] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 11);
    setBvn(val);
  };

  const handleVerify = async () => {
    if (bvn.length !== 11) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    onVerify();
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter BVN</h1>
        <p className={styles.subtitle}>
          Please enter your 11-digits Bank Verification Number
        </p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>BVN Number</label>
        <div
          className={`${styles.inputWrapper} ${
            isFocused ? styles.inputFocused : ""
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={bvn}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="12345678901"
            className={styles.input}
            maxLength={11}
          />
        </div>
        <span
          className={`${styles.charCount} ${
            bvn.length === 11 ? styles.charCountFull : ""
          }`}
        >
          {bvn.length}/11 digits
        </span>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.secondaryBtn} onClick={onBack}>
          Back
        </button>
        <button
          className={`${styles.primaryBtn} ${styles.verifyBtn} ${
            bvn.length !== 11 ? styles.btnDisabled : ""
          }`}
          onClick={handleVerify}
          disabled={bvn.length !== 11 || isLoading}
        >
          {isLoading ? (
            <span className={styles.spinner} />
          ) : (
            "Verify BVN"
          )}
        </button>
      </div>
    </div>
  );
};

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

    <button className={`${styles.primaryBtn} ${styles.successBtn}`} onClick={onBack}>
      Back
    </button>
  </div>
);

export default function KYCVerification() {
  const [step, setStep] = useState<Step>("overview");
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const stepToNum: Record<Step, number> = {
    overview: 1,
    info: 2,
    enter: 2,
    success: 3,
  };

  const navigate = (next: Step, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 300);
  };

  const contentClass = `${styles.contentWrap} ${
    animating
      ? direction === "forward"
        ? styles.slideOutLeft
        : styles.slideOutRight
      : direction === "forward"
      ? styles.slideInRight
      : styles.slideInLeft
  }`;

  if (step === "success") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={contentClass}>
            <SuccessStep onBack={() => navigate("overview", "back")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StepIndicator current={stepToNum[step]} />
      <div className={contentClass}>
        {step === "overview" && (
          <OverviewStep onContinue={() => navigate("info")} />
        )}
        {step === "info" && (
          <InfoStep
            onContinue={() => navigate("enter")}
            onBack={() => navigate("overview", "back")}
          />
        )}
        {step === "enter" && (
          <EnterStep
            onVerify={() => navigate("success")}
            onBack={() => navigate("info", "back")}
          />
        )}
      </div>
    </div>
  );
}