import React from "react";
import styles from "./LoanSelect.module.css";

type Props = {
  label: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
};

const LoanSelect = ({ label, options, value, defaultValue, onChange, placeholder, error }: Props) => (
  <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <select
      className={`${styles.select} ${error ? styles.error : ""}`}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {placeholder && <option className={styles.option} value="">{placeholder}</option>}
      {options.map((opt) => (
        <option className={styles.option} key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <span className={styles.errorMessage}>{error}</span>}
  </div>
);

export default LoanSelect;