import React from 'react';
import styles from './DateInput.module.css';

type Props = {
  label: string;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DateInput = ({ label, icon, ...inputProps }: Props) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input type="date" className={styles.input} {...inputProps} />
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
    </div>
  );
};

export default DateInput;
