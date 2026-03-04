import React, { useRef, useState } from "react";
import styles from "../addaccountverification.module.css";

const EnterStep = ({
  onVerify,
  onBack,
}: {
  onVerify: () => void;
  onBack: () => void;
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(val);
  };
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAccountName(val);
  };

  const handleVerify = async () => {
    if (accountNumber.length !== 10) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    onVerify();
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>Enter Primary Account</h1>
        <p className={styles.subtitle}>
          Please enter your 10-digits Primary Bank Account Number
        </p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Account Number</label>
        <div
          className={`${styles.inputWrapper} ${
            isFocused ? styles.inputFocused : ""
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="1234567890"
            className={styles.input}
            maxLength={10}
          />
        </div>
        <span
          className={`${styles.charCount} ${
            accountNumber.length === 10 ? styles.charCountFull : ""
          }`}
        >
          {accountNumber.length}/10 digits
        </span>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Account Name</label>
        <div
          className={`${styles.inputWrapper} ${
            isFocused2 ? styles.inputFocused : ""
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            value={accountName}
            onChange={handleChange2}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Name of Bank"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.secondaryBtn} onClick={onBack}>
          Back
        </button>
        <button
          className={`${styles.primaryBtn} ${styles.verifyBtn} ${
            accountNumber.length !== 10 ? styles.btnDisabled : ""
          }`}
          onClick={handleVerify}
          disabled={accountNumber.length !== 10 || isLoading}
        >
          {isLoading ? <span className={styles.spinner} /> : "Add Account Details"}
        </button>
      </div>
    </div>
  );
};

export default EnterStep;
