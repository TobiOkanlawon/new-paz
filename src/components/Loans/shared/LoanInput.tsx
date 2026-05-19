import React from "react";
import styles from "./LoanInput.module.css";

type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
};

const LoanInput = ({ label, placeholder, type = "text", value, onChange, rightElement }: Props) => (
  <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {rightElement && <span className={styles.right}>{rightElement}</span>}
    </div>
  </div>
);

export default LoanInput;