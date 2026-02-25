import React, { useRef, useState } from "react";
import styles from "../kycverification.module.css";

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
          {isLoading ? <span className={styles.spinner} /> : "Verify BVN"}
        </button>
      </div>
    </div>
  );
};

export default EnterStep;
