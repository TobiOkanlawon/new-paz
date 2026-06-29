import React from "react";
import styles from "./LoanSelect.module.css";

type Props = {
  label: string;
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
} & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

const LoanSelect = ({ label, options, value, defaultValue, onChange, placeholder, onBlur }: Props) => (
  <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <select className={styles.select} value={value} defaultValue={defaultValue} onChange={onChange} onBlur={onBlur}>
      {placeholder && <option className={styles.option} value="">{placeholder}</option>}
      {options.map((opt) => (
        <option className={styles.option} key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default LoanSelect;